import css from '@/components/css/convertToJs'
import Footer from '@/components/Footer'
import { Main, Section } from '@/components/UI'
import Link from '@/node_modules/next/link'

export default function APIDoc() {
  return (
    <Main>
      <Section>
        <h2>Confidentialité et mentions légales</h2>

        <h2>Confidentialité</h2>
        <h3>Traceurs</h3>
        <p>
          Nous utilisons le traceur libre Matomo, via l'instance hébergée par
          les services de l'État sur stats.beta.gouv.fr.
        </p>
        <p>
          Quand vous faites une simulation sur Mes Aides Réno, et que vous
          saisissez par exemple votre catégorie de revenu, cette information est
          reçue par notre serveur (car les données sont stockées dans la barre
          d'adresse de votre navigateur), l'adresse est stockée dans notre outil
          de suivi d'audience, mais aucun compte utilisateur nominatif n'est
          créé et les données ne sont utilisées que pour améliorer les parcours
          sur le site et la fiabilité du modèle de calcul.
        </p>
        <p>
          L'outil de suivi Matomo est configuré pour un suivi qui ne nécessite
          pas de bannière de consentement RGPD (dite "cookies").
        </p>
        <h3>Serveur</h3>
        <p>
          Notre serveur est géré par la société française{' '}
          <a href="https://scalingo.com/">Scalingo</a>, et sont physiquement
          localisés en France. Voici la{' '}
          <a href="https://annuaire-entreprises.data.gouv.fr/entreprise/scalingo-808665483">
            fiche entreprise
          </a>{' '}
          de Scalingo.
        </p>
        <h2>Mentions légales</h2>
        <p>
          Ce site Web est opéré par la{' '}
          <a href="https://annuaire-entreprises.data.gouv.fr/entreprise/direction-interministerielle-du-numerique-dinum-130025265">
            Direction du Numérique de l'État français
          </a>
          .
        </p>
      </Section>
      <Footer />
    </Main>
  )
}
