'use client'

import InputSwitch from '@/components/InputSwitch'
import { Section } from '@/components/UI'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import rules from '@/app/règles/rules'
import { getAnsweredQuestions, getSituation } from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'
import Answers from '@/app/simulation/Answers'

export default function Copropriete() {
    useSyncUrlLocalStorage()
    const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
    const engine = useMemo(() => new Publicodes(rules), [rules])
    const answeredQuestions = [
      ...getAnsweredQuestions(searchParams, rules),
    ]
    const situation = {
      ...getSituation(searchParams, rules),
    }
  
    const validatedSituation = Object.fromEntries(
      Object.entries(situation).filter(([k, v]) => answeredQuestions.includes(k)),
    )
  
    const evaluation = engine.setSituation(validatedSituation).evaluate('copropriété . montant')
    const nextQuestions = getNextQuestions(
        evaluation,
        answeredQuestions,
        {
            'prioritaires': [
                'copropriété . nombre de logement',
                'copropriété . pourcentage résidence principale . minimum 75 %',
                'copropriété . pourcentage résidence principale . minimum 65 %',
                'copropriété . gain énergétique',
                'copropriété . bonus sortie passoire',
                'copropriété . bonus fragile',
            ]
        },
        rules,
      )
  
    const currentQuestion = nextQuestions[0],
      rule = currentQuestion && rules[currentQuestion]
  
    const setSearchParams = useSetSearchParams()

    return (
    <div>
      <Section>
        <Answers
          {...{
            answeredQuestions,
            nextQuestions,
            currentQuestion,
            rules,
            situation,
          }}
        />
        {rule && (
          <InputSwitch
            {...{
              rules,
              currentQuestion,
              situation,
              answeredQuestions,
              setSearchParams,
              engine,
              nextQuestions,
              searchParams,
            }}
          />
        )}
      </Section>
    </div>
  )
}
