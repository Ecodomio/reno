import { Details, Fieldset } from './BooleanMosaicUI'
import css from './css/convertToJs'
import { encodeSituation } from './publicodes/situationUtils'
import { getRuleName } from './publicodes/utils'
import Engine, { formatValue } from 'publicodes'
import rules from '@/app/règles/rules'

export const isGestesMosaicQuestion = (currentQuestion, rule, rules) => {
  const localIsMosaic = (dottedName, rule) =>
    dottedName.startsWith('gestes . ') &&
    rule &&
    ['oui', 'non'].includes(rule['par défaut'])
  if (!localIsMosaic(currentQuestion, rule)) return false

  const questions = Object.entries(rules).filter(([dottedName, rule]) =>
    localIsMosaic(dottedName, rule),
  )
  return questions
}

export const gestesMosaicQuestionText = (rules, currentQuestion) => {
  const rule = rules['gestes . montant']
  return rule.mosaïque && rule.question
}

export default function GestesMosaic({
  rules,
  setSearchParams,
  rule,
  situation,
  answeredQuestions,
  questions,
  engine,
}) {
  const grouped = questions.reduce(
      (memo, [q, rule]) => {
        const categoryDottedName = q.split(' . ').slice(0, -1).join(' . ')

        return {
          ...memo,
          [categoryDottedName]: [...(memo[categoryDottedName] || []), q],
        }
      },

      {},
    ),
    entries = Object.entries(grouped)

  const levels = entries.map(([el]) => el.split(' . ').length),
    minimum = Math.min(...levels),
    maximum = Math.max(...levels)

  if (maximum - minimum > 1) {
    throw new Error('The UI cannot yet handle 3 level mosaic questions')
  }

  const categories = entries.filter((el) => el[0].split(' . ').length === 2)

  console.log({ entries })

  const onChange = (dottedName) => {
    const encodedSituation = encodeSituation(
      {
        ...situation,
        [dottedName]: situation[dottedName] === 'oui' ? 'non' : 'oui',
      },
      false,
      answeredQuestions,
    )
    console.log('on change will set encodedSituation', encodedSituation)

    setSearchParams(encodedSituation, 'push', false)
    console.log('set situation', dottedName)
  }

  console.log('situation', situation)
  const evaluation = engine
      .setSituation(situation)
      .evaluate('gestes . montant'),
    value = formatValue(evaluation)

  return (
    <div>
      <h2>Quels gestes vous intéressent ?</h2>
      <p
        css={`
          text-align: right;
          max-width: 30rem;
          margin: 0 0 0 auto;
          color: #666;
        `}
      >
        <small>
          Lecture : pour chaque geste, une prime de <Prime value={'xxx €'} />{' '}
          sera versée si le montant du geste est en-dessous d'un plafond
          maximum.
        </small>
      </p>
      <div
        css={`
          margin-top: 0.6rem;
          position: sticky;
          top: 2rem;
          > div {
            text-align: center;
            border: 2px solid #7eb48f;
            padding: 0.2rem 0.4rem;
            background: #c4fad5;
            width: 10rem;
            margin: 0;
            margin-left: auto;
          }
        `}
      >
        <div>Total = {value}</div>
      </div>
      <Fieldset>
        <ul>
          {categories.map(([category, dottedNames]) => (
            <li key={category}>
              <Details open={true}>
                <summary>
                  <h4>{rules[category].titre}</h4>
                </summary>

                <ul>
                  <Checkboxes
                    {...{
                      questions: dottedNames,
                      rules,
                      onChange,
                      situation,
                    }}
                  />
                  {entries
                    .filter(
                      ([k, v]) => k.startsWith(category) && k !== category,
                    )
                    .map(([subCategory, dottedNames2]) => {
                      const categoryTitle = rules[subCategory].titre

                      return (
                        <li key={subCategory}>
                          <h5>{categoryTitle}</h5>
                          <ul>
                            <Checkboxes
                              {...{
                                questions: dottedNames2,
                                rules,
                                onChange,
                                situation,
                              }}
                            />
                          </ul>
                        </li>
                      )
                    })}
                </ul>
              </Details>
            </li>
          ))}
        </ul>
      </Fieldset>
    </div>
  )
}

const safeEngine = new Engine(rules)

const Checkboxes = ({ questions, rules, onChange, situation }) => {
  return questions.map((dottedName) => {
    const questionRule = rules[dottedName]

    const montant = dottedName + ' . montant',
      montantValue = formatValue(safeEngine.evaluate(montant))

    const plafond = dottedName + ' . plafond',
      plafondValue = formatValue(safeEngine.evaluate(plafond))
    return (
      <li
        key={dottedName}
        style={css`
          margin-bottom: 0.6rem;
        `}
      >
        <label key={dottedName}>
          <input
            style={css`
              margin-right: 1rem;
              cursor: pointer;
            `}
            type="checkbox"
            checked={situation[dottedName] === 'oui'}
            onChange={() => onChange(dottedName)}
          />
          <div>
            <div>{questionRule.titre || getRuleName(dottedName)}</div>

            <small style={css``}>
              <Prime value={`- ${montantValue}`} /> sur max. {plafondValue}
            </small>
          </div>
        </label>
      </li>
    )
  })
}

const Prime = ({ value }) => (
  <span
    style={css`
      color: rgb(11, 73, 48);
      background: #c4fad5;
      padding: 0 0.3rem;
      border-radius: 0.2rem;
      white-space: nowrap;
    `}
  >
    {value}
  </span>
)
