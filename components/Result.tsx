import { Labels } from '@/app/LandingUI'
import css from '@/components/css/convertToJs'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Link from 'next/link'
import { styled } from 'styled-components'
import { PrimeStyle } from './Geste'
import { CTA, CTAWrapper, Card, cardBorder } from './UI'
import { ExplicationMPRA, ExplicationMPRG } from './explications/Éligibilité'
import GestesPreview from './mprg/GestesPreview'

/* This component was first written for simulation mode where the state could be success, running or fail. Since then we've switched to a more classic result where it
 * can only be success or fail. I've kept this object for future references, for its colors */
export const colors = {
  success: {
    background: '#297254',
    lightBackground: '#c4fad5', //TODO use this for the contour, more beautiful
    label: 'Estimation finale',
  },
  running: {
    background: 'var(--color)',
    color: 'white',
    label: 'Sous conditions',
  },
  fail: {
    background: 'salmon',
    lightBackground: '#f6b7af',
    color: 'white',
    label: 'Non éligible',
  },
  //  waiting: { background: '#9f9f9f', color: 'white', label: 'À suivre' },
}

export default function Result({
  engine,
  isFinal,
  rules,
  dottedName,
  hideNumeric = false,
  index,
  url,
  situation,
}) {
  const rule = rules[dottedName]
  const evaluation = engine.evaluate(dottedName)
  console.log('result', evaluation)
  console.log(
    'condi',
    engine.evaluate('MPR . non accompagnée . conditions excluantes'),
  )

  const value = formatValue(evaluation, { precision: 0 })
  const isNotApplicable =
    value === 'Non applicable' || evaluation.nodeValue === 0

  const state = isNotApplicable ? 'fail' : isFinal ? 'success' : 'running',
    fail = state === 'fail'
  const { color, background, label } = colors[state]
  const MPRA = dottedName === 'MPR . accompagnée'

  return (
    <li
      css={`
        margin: 0;
        width: 22rem;
        max-width: min(22rem, 90%);
        @media (min-width: 800px) {
          width: 100%;
          max-width: initial;
        }
        border-color: ${fail ? '#ddd' : '#dfdff1'};

        position: relative;

        h3 {
          font-size: 120%;
          margin: 2rem 0 0.4rem;
        }
        @media (min-width: 800px) {
        }
      `}
    >
      {' '}
      {MPRA ? (
        <section>
          <header>
            <h3>L'État vous accompagne</h3>
            <p>
              L'aide principale en 2024 pour faire une rénovation d'ampleur.
            </p>
          </header>
          <Card
            css={`
              color: ${fail ? '#888' : 'inherit'};
              margin-top: 0.2rem;
              background: white;
            `}
          >
            <Labels
              $color={'#6E4444'}
              $background={'#fdf8db'}
              css={`
                margin-top: 0.3rem;
              `}
            >
              {['🤝 Un professionnel vous accompagne'].map((text) => (
                <li key={text}>{text}</li>
              ))}
            </Labels>
            <h4
              style={css`
                font-weight: 400;
                margin: 1rem 0 0rem;
                font-size: 120%;
              `}
              dangerouslySetInnerHTML={{ __html: rule.titreHtml }}
            />

            {fail ? (
              <div
                css={`
                  margin: 1rem 0;
                  color: black;
                  text-align: center;
                `}
              >
                <ExplicationMPRA {...{ engine, situation }} />
              </div>
            ) : (
              <PrimeStyle $inactive={fail}>
                {isFinal ? `` : fail ? `` : `Jusqu'à `} <strong>{value}</strong>
              </PrimeStyle>
            )}
            <p
              css={`
                margin-top: 1.4rem;
              `}
            >
              Un programme sur-mesure pour gagner au minimum{' '}
              <strong>deux&nbsp;classes&nbsp;DPE</strong>.
            </p>
            <div
              css={`
                visibility: ${!isNotApplicable && url ? 'visible' : 'hidden'};
                > div {
                  margin-bottom: 0.3rem;
                  margin-top: 1rem;
                }
              `}
            >
              <CTAWrapper $justify="start">
                <CTA $fontSize="normal">
                  <Link href={url}>
                    {MPRA
                      ? 'Découvrir le détail'
                      : 'Voir les 20 gestes disponibles'}
                  </Link>
                </CTA>
              </CTAWrapper>
            </div>
          </Card>
        </section>
      ) : (
        <section>
          <header>
            <h3>Les aides à la carte</h3>
            <p>Rénovez progressivement votre logement.</p>
          </header>
          <Card
            css={`
              color: ${fail ? '#888' : 'inherit'};
            `}
          >
            <h4
              style={css`
                font-weight: 400;
                margin: 1rem 0 0rem;
                font-size: 120%;
              `}
              dangerouslySetInnerHTML={{ __html: rule.titreHtml }}
            />
            {fail && (
              <div
                css={`
                  margin: 1rem 0;
                  color: black;
                  text-align: center;
                `}
              >
                <ExplicationMPRG {...{ engine, situation }} />
              </div>
            )}

            <p
              css={`
                margin-top: 1.4rem;
              `}
            >
              Choisissez vos travaux dans un bouquet de gestes subventionnés.
            </p>
            {!fail ? (
              <GestesPreview
                {...{
                  rules,
                  inactive: fail,
                  dottedNames: [
                    'gestes . recommandés . audit',
                    'gestes . chauffage . PAC . air-eau',
                    'gestes . isolation . murs extérieurs',
                  ],
                  engine,
                  situation,
                }}
              />
            ) : (
              <span>
                <a
                  target="_blank"
                  href="https://www.service-public.fr/particuliers/vosdroits/F35083"
                >
                  En savoir plus sur ce parcours
                </a>
                .
              </span>
            )}
            <div
              css={`
                display: ${!isNotApplicable && url ? 'visible' : 'none'};
                > div {
                  margin-bottom: 0.3rem;
                  margin-top: 1.6rem;
                }
              `}
            >
              <CTAWrapper $justify="start">
                <CTA $fontSize="normal">
                  <Link href={url}>
                    {MPRA ? (
                      'Découvrir le détail'
                    ) : (
                      <span>
                        Voir les <strong>20</strong> gestes disponibles
                      </span>
                    )}
                  </Link>
                </CTA>
              </CTAWrapper>
            </div>
          </Card>
        </section>
      )}
    </li>
  )
}

export const Results = styled.ul`
  padding-left: 0;
  margin-top: 1rem;
  list-style-type: none;
  @media (max-width: 800px) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex-direction: column;
    > span {
      margin: 0.6rem;
    }
  }
`
