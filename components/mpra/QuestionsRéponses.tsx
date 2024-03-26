import Link from 'next/link'
import { BlocQuestionRéponse } from '../BlocQuestionRéponse'
import DPELabel from '../DPELabel'
import { Value } from '../ScenariosSelector'
import { encodeDottedName } from '../publicodes/situationUtils'
import useSetSearchParams from '../useSetSearchParams'

export default function QuestionsRéponses({
  engine,
  situation,
  oldIndex,
  choice,
}) {
  const setSearchParams = useSetSearchParams()
  const mprg = engine.evaluate('MPR . non accompagnée').nodeValue
  return (
    <section>
      <h2>Questions fréquentes</h2>

      <BlocQuestionRéponse>
        <details>
          <summary open={false}>Quelle est la procédure ?</summary>
          <ol
            css={`
              li {
                margin: 1.5vh 0;
              }
            `}
          >
            <li>
              Je m'informe sur les aides, et si besoin{' '}
              <a href="https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov">
                j'appelle un conseiller France Rénov'
              </a>
              .
            </li>
            <li>
              Je suis orienté vers un accompagnateur Rénov' qui m'aide à
              construire mon projet et m'accompagnera tout au long des travaux.{' '}
              <ol>
                <li>Réalisation d'un audit</li>
                <li>
                  Réalisation de plusieurs devis auprès d'artisans certifiés
                  RGE.
                </li>
              </ol>
            </li>
            <li>
              Je monte mon dossier de financement (en demandant ou non une
              avance) et le dépose auprès de l'Anah.
            </li>
            <li>Je fais réaliser mes travaux.</li>
            <li>
              Je prends en main mon logement rénové avec mon accompagnateur
              Rénov' lors de la deuxième visite.
            </li>
            <li>Je paie mes factures et obtiens mes aides.</li>
          </ol>
        </details>
        <details>
          <summary open={false}>
            Y a-t-il des conditions supplémentaires ?
          </summary>
          <p>
            Outre les sauts de classe, votre projet de rénovation devra
            respecter les conditions suivantes :
          </p>
          <ul>
            <li>
              Il est obligatoire de réaliser au moins deux gestes d’isolation
              (murs, fenêtres / menuiserie, sols ou toiture).{' '}
            </li>
            <li>
              Il est impossible d’installer un chauffage fonctionnant
              majoritairement aux énergies fossiles (par ex. chaudière à gaz) ou
              de conserver un chauffage fonctionnant au fioul ou au charbon.
            </li>
            <li>
              Vos artisans doivent être{' '}
              <a
                href="https://www.ecologie.gouv.fr/label-reconnu-garant-lenvironnement-rge"
                target="_blank"
              >
                certifiés RGE
              </a>
              .
            </li>
          </ul>
        </details>

        <details>
          <summary open={false}>Qui paie l'Accompagnateur Rénov' ?</summary>
          <p>
            Pour rappel, le revenu que vous avez saisi vous classe en
            ménage&nbsp;
            <Value
              {...{
                engine,
                index: choice,
                situation: { ...situation },
                dottedName: 'ménage . revenu . classe',
                state: 'emphasize',
              }}
            />
            .
          </p>

          <p>
            L'État prend en charge jusqu'à 100 % des prestations des
            Accompagnateurs Rénov' pour les ménages très modestes, dans une
            limite de 2 000 €. Cette prise en charge sera de 80 % pour les
            ménages modestes, de 40 % pour ceux aux revenus intermédiaires et de
            20 % pour les revenus supérieurs.
          </p>
          <p>
            Si une prestation renforcée est nécessaire pour une situation de
            lutte contre l’habitat indigne, 2 000 € supplémentaires viennent
            compléter la somme initiale.
          </p>
          <p>
            <em>Source non officielle, à confirmer.</em>
          </p>
        </details>
        <details>
          <summary open={false}>Quels sont les délais ?</summary>
          <p>À remplir</p>
        </details>
        <details>
          <summary open={false}>Y a-t-il des aides locales ?</summary>
          <p>
            En fonction de la localisation de votre bien ou de votre ménage,
            vous pouvez être éligibles à des aides locales qui se cumulent aux
            aides nationales.{' '}
          </p>
          <p>
            Nous ne proposons pas encore le calcul de ces aides, il faudra aller
            vous renseigner{' '}
            <a href="https://www.anil.org/aides-locales-travaux/">en ligne</a>{' '}
            ou auprès d'un conseiller d'une agence locale.
          </p>
        </details>
        <details>
          <summary open={false}>Peut-on cumuler les aides ?</summary>
          <p>
            MaPrimeRenov’ Parcours accompagné n’est pas cumulable avec les aides
            des fournisseurs d’énergie (CEE).
          </p>
          <p>
            MaPrimeRenov’ Parcours accompagné est cumulable avec les aides des
            collectivité locales et des caisses de retraite.
          </p>
          <p>
            L'aide du parcours accompagnée est limitée par un montant maximum,
            appelé l'écrêtement, calculé ci-dessus.
          </p>
        </details>
        <details>
          <summary open={false}>C'est trop ambitieux pour moi</summary>
          <p>
            Le parcours accompagné de MaPrimeRénov' exige en effet un minimum de
            deux sauts de DPE, en échange d'un montant d'aide important.
          </p>
          {oldIndex >= 4 && (
            <p>
              Pour les logements de classe E, F ou G avant travaux (vous avez
              saisi <DPELabel index={oldIndex} /> ), il est possible de faire
              des rénovations en 2 étapes sur une durée de 5 ans. Voir la{' '}
              <a href="https://www.anah.gouv.fr/sites/default/files/2024-02/202402_Guide_des_aides_WEBA.pdf#page=21">
                page 21 du guide de l'ANAH
              </a>
              .
            </p>
          )}
          {mprg ? (
            <p>
              Bonne nouvelle, vous êtes également éligible au parcours par geste
              de MaPrimeRénov'. Vous pouvez{' '}
              <Link
                href={setSearchParams(
                  { objectif: encodeDottedName('MPR . non accompagnée') },
                  'url',
                )}
              >
                découvrir le parcours par geste
              </Link>
              .
            </p>
          ) : (
            <p>
              Vous n'êtes pas éligible au parcours par geste de MaPrimeRénov'.
              Sous certaines conditions, vous pourriez cependant avoir accès à
              l'
              <a href="https://www.ecologie.gouv.fr/eco-pret-taux-zero-eco-ptz">
                éco-prêt à taux zéro (PTZ)
              </a>
              .
            </p>
          )}
        </details>
      </BlocQuestionRéponse>
    </section>
  )
}
