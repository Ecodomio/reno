import { Labels } from '@/app/LandingUI'
import css from '@/components/css/convertToJs'
import { formatValue } from '@/node_modules/publicodes/dist/index'
import Link from 'next/link'
import { styled } from 'styled-components'
import { PrimeStyle } from './Geste'
import { CTA, CTAWrapper, cardBorder } from './UI'
import { ExplicationMPRA, ExplicationMPRG } from './explications/Éligibilité'

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
      style={css(`
	  color: ${fail ? '#888' : 'inherit'};
        padding: 1.4rem 1.5rem;
        margin: .6rem auto;
		width: 22rem;
        max-width: min(22rem, 90%);
		background: white;
		${cardBorder};
		border-color: ${fail ? '#ddd' : '#dfdff1'};

	position: relative;

    display: flex;
    flex-direction: column;
    align-items: start;
	justify-content: space-between;
      `)}
    >
      {MPRA && (
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
      )}
      <h3
        style={css`
          font-weight: 400;
          margin: 1rem 0 0rem;
        `}
        dangerouslySetInnerHTML={{ __html: rule.titreHtml }}
      />

      {MPRA && (
        <PrimeStyle>
          {isFinal ? `` : `Jusqu'à `} <strong>{value}</strong>
        </PrimeStyle>
      )}
      {MPRA && (
        <p
          css={`
            margin-top: 1.4rem;
          `}
        >
          Vous serez accompagné pour rénover votre logement et gagner au minimum{' '}
          <strong>deux classes DPE</strong>.
        </p>
      )}
      {fail && (
        <div
          css={`
            margin: 1rem 0;
            color: black;
            text-align: center;
          `}
        >
          {!MPRA ? (
            <ExplicationMPRG {...{ engine, situation }} />
          ) : (
            <ExplicationMPRA {...{ engine, situation }} />
          )}
        </div>
      )}
      <div
        css={`
          visibility: ${!isNotApplicable && url ? 'visible' : 'hidden'};
          > div {
            margin-bottom: 0.3rem;
            margin-top: 1rem;
          }
        `}
      >
        <CTAWrapper>
          <CTA $fontSize="normal">
            <Link href={url}>
              {MPRA ? 'Découvrir le détail' : 'Voir les 20 gestes disponibles'}
            </Link>
          </CTA>
        </CTAWrapper>
      </div>
    </li>
  )
}

export const Results = styled.ul`
  padding-left: 0;
  margin-top: 1rem;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  @media (max-width: 800px) {
    flex-direction: column;
    > span {
      margin: 0.6rem;
    }
  }
`
