import { Results } from '@/components/ResultUI'
import checkIcon from '@/public/check.svg'
import crossIcon from '@/public/remix-close-empty.svg'
import Image from 'next/image'
import { useMemo } from 'react'
import AmpleurSummary from './AmpleurSummary'
import AutresAides from './AutresAides'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import { Avis, ExplicationCommune } from './explications/Éligibilité'
import { encodeDottedName } from './publicodes/situationUtils'
import ÀlaCarteSummary from './ÀlaCarteSummary'

export default function Eligibility({
  setSearchParams,
  situation,
  currentQuestion,
  answeredQuestions,
  rules,
  engine,
  expanded,
}) {
  const nextLink = (value) => {
    const url = setSearchParams(
      { objectif: encodeDottedName(value) },
      'url',
      false,
    )
    return url
  }

  const [mpraEvaluation, mprgEvaluation] = useMemo(() => {
      const newEngine = engine.setSituation(situation)
      return [
        newEngine.evaluate('MPR . accompagnée . éligible'),
        newEngine.evaluate('MPR . non accompagnée . éligible'),
      ]
    }, [situation, engine]),
    mpra = mpraEvaluation.nodeValue,
    mprg = mprgEvaluation.nodeValue

  const both = mpra && mprg,
    none = !mpra && !mprg,
    some = mpra || mprg
  return (
    <CustomQuestionWrapper>
      <header>
        <small>Découvrez vos aides</small>
        <h2>
          {some ? (
            <span
              css={`
                display: flex;
                align-items: center;
                img {
                  margin-right: 0.4rem;
                  width: 1.8rem;
                  height: auto;
                }
              `}
            >
              <Image src={checkIcon} alt="Icône case cochée" /> Bonne nouvelle !
            </span>
          ) : (
            'Votre éligibilité'
          )}
        </h2>
      </header>
      {none ? (
        <div>
          <p
            css={`
              text-decoration: underline;
              text-decoration-color: salmon;
              display: flex;
              align-items: center;
              img {
                margin-right: 0.4rem;
                height: 1.6rem;
                width: auto;
              }
            `}
          >
            <Image src={crossIcon} alt="Icône d'une croix" />
            Vous n'êtes pas éligible aux aides Ma Prime Rénov.
          </p>

          <ExplicationCommune {...{ situation, engine }} />
        </div>
      ) : mpra && !mprg ? (
        <p>
          Vous êtes éligible au parcours accompagné. Vous n'êtes pas éligible au
          parcours par geste.
        </p>
      ) : !mpra && mprg ? (
        <p>
          Vous n'êtes pas éligible au parcours accompagné. Vous êtes cependant
          éligible au parcours par geste.
        </p>
      ) : (
        both && (
          <div>
            <p>
              Vous êtes éligible aux deux parcours, le parcours accompagné et le
              parcours par gestes. Vous devez choisir l'un des deux parcours.
            </p>
            <Avis {...{ situation, engine }} />
          </div>
        )
      )}

      <Results>
        <li>
          <AmpleurSummary
            {...{
              engine,
              url: nextLink('ampleur'),
              situation,
              expanded,
              setSearchParams,
            }}
          />
        </li>
        <li>
          <ÀlaCarteSummary
            {...{ engine, url: nextLink('MPR . non accompagnée . montant'), situation }}
          />
        </li>
      </Results>
      <AutresAides />
    </CustomQuestionWrapper>
  )
}
