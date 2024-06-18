'use client'
import rules from '@/app/règles/rules'
import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
import { Main, Section } from '@/components/UI'
import { getRuleTitle, parentName } from '@/components/publicodes/utils'
import { capitalise0, omit, sortBy } from '@/components/utils'
import { useMemo, useState } from 'react'
import SituationEditor from '../SituationEditor'
import aides from '@/app/règles/aides-locales.publicodes'
import Publicodes, { formatValue } from 'publicodes'

const aidesEntries = Object.entries(aides)
const toSum = aidesEntries
    .filter(
      ([dottedName, value]) => dottedName && dottedName.endsWith(' . montant'),
    )
    .map(([dottedName, value]) => 'aides locales . ' + dottedName),
  sum = { somme: toSum }

const baseEngine = new Publicodes({ ...rules, 'somme des aides locales': sum })
const evaluation = baseEngine.evaluate('somme des aides locales')
const { missingVariables } = evaluation
// TODO je crois que l'itinialisation ici fait peut-être louper des missing variables qui apparaissent après

const defaultSituationEntries = sortBy(([, score]) => score)(
  Object.entries(missingVariables),
)
  .map(
    ([dottedName]) =>
      dottedName !== 'simulation . mode' && [
        dottedName,
        baseEngine.evaluate(dottedName).nodeValue,
      ],
  )
  .filter(Boolean)

export default function LocalePlace({ place }) {
  const [situationEntries, setSituationEntries] = useState(
    defaultSituationEntries,
  )

  console.log('plop', missingVariables)
  const placeRules = aidesEntries.filter(([dottedName, rule]) =>
    dottedName.startsWith(place),
  )

  const [engine, situation] = useMemo(() => {
    try {
      const situation = Object.fromEntries(
        [
          // The situation was evaluted from the evaluation of default values
          // the result is not compatible with the object we need to inject in Engine.setSituation
          ...situationEntries.map(([dottedName, value]) => {
            if ([true, false, 'true', 'false'].includes(value))
              return [
                dottedName,
                { true: 'oui', true: 'oui', false: 'non', false: 'non' }[value],
              ]

            if (dottedName === 'simulation . mode') return

            return [dottedName, value]
          }),
          ...aidesEntries
            .filter(([dottedName, rule]) =>
              dottedName.endsWith('conditions géo'),
            )
            .map(([dottedName, rule]) => [
              'aides locales . ' + dottedName,
              'oui',
            ]),
        ].filter(Boolean),
      )
      console.log(
        'situation',
        situation,
        Object.fromEntries(defaultSituationEntries),
      )

      const engine = baseEngine.setSituation(situation)

      console.log('Success loading situation in Publicodes engine ')
      return [engine, situation]
    } catch (e) {
      console.error('Error loading situation in Publicodes engine : ', e)
      return [baseEngine, situation]
    }
  }, [situationEntries, baseEngine])

  return (
    <div css={``}>
      <Section>
        <h1>Aides locales {capitalise0(place)}</h1>
        <p>
          Découvrez ci-dessous les aides locales {capitalise0(place)}. Vous
          pouvez changer la situation de votre ménage pour voir l'évolution du
          montant et de l'éligibilité des aides.
        </p>
      </Section>
      <div
        css={`
          display: flex;
          overflow: scroll;
        `}
      >
        <div
          css={`
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            left: 6rem;
          `}
        >
          <h2>Votre situation</h2>
          <SituationEditor {...{ situationEntries, setSituationEntries }} />
        </div>
        <Section
          css={`
            margin-top: 2rem;
          `}
        >
          <ul
            css={`
              list-style-type: none;
            `}
          >
            {sortBy(
              ([dottedName]) =>
                dottedName == place || !dottedName.endsWith('montant'),
            )(placeRules).map(([dottedName, rule]) => {
              if (rule == null) return

              const evaluation = engine.evaluate(
                'aides locales . ' + dottedName,
              )
              const value = formatValue(evaluation)

              const isMontant = dottedName.endsWith('montant')

              return (
                <li
                  key={dottedName}
                  css={`
                    margin: 0.6rem 0;
                  `}
                >
                  {dottedName !== place && (
                    <div
                      css={`
                        display: flex;
                        justify-content: space-between;
                      `}
                    >
                      <span
                        css={`
                          display: flex;
                          flex-direction: column;
                        `}
                      >
                        <small>
                          {parentName(dottedName).split(place + ' . ')[1]}
                        </small>
                        <h3
                          css={`
                            font-size: 100%;
                            margin: 0;
                            width: fit-content;
                            ${isMontant && `background: yellow`}
                          `}
                        >
                          {getRuleTitle(dottedName, aides)}
                        </h3>
                      </span>
                      <span>{value}</span>
                    </div>
                  )}
                  <div
                    css={`
                      > div {
                        border: 1px solid #aaa;
                        > ul {
                          padding-left: 0.6rem;
                          margin: 0.6rem 0;
                        }
                      }
                    `}
                  >
                    {typeof rule === 'string' ? (
                      <div>{rule}</div>
                    ) : (
                      <FriendlyObjectViewer
                        {...{
                          data: omit(['titre'], rule),
                          options: {
                            keyStyle: `
									color: #41438a
									`,
                          },
                        }}
                      />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </Section>
      </div>
    </div>
  )
}
