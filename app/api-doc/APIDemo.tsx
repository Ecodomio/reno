'use client'
import { useMemo, useState } from 'react'
import { parse, stringify } from 'yaml'
import example from '@/app/api-doc/api-example.yaml'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import { useDebounce } from 'use-debounce'
import styled from 'styled-components'

const engine = new Publicodes(rules)
export default function APIDemo({titre, type}) {
  const [yaml, setYaml] = useState(stringify(example[type]))
  const [debouncedYaml] = useDebounce(yaml, 500)
  
  const montant = useMemo(() => {
    try {
      const json = parse(debouncedYaml)
      const evaluation = engine
        .setSituation(json)
        .evaluate(type == "mprg" ? 
          'gestes . chauffage . PAC . air-eau . MPR . montant' : 
          (type == "copropriete" ?
            'copropriété . montant' :
            (type == "cee" ? 'gestes . isolation . murs extérieurs . CEE . montant' : ' MPR . accompagnée . montant')
          )
        )
      return formatValue(evaluation, { precision: 0 })
    } catch (e) {
      console.log(e)
      return e
    }
  }, [debouncedYaml])

  return (
    <section
      css={`
        margin: 2rem 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
      `}
    >
      <TextArea
        value={yaml}
        onChange={(e) => console.log('onchange') || setYaml(e.target.value)}
      />
      <EvaluationValue>
        <small>{titre}</small>{' '}
        <div>{typeof montant === 'string' ? montant : <p>{montant.toString()}</p>}</div>
      </EvaluationValue>
    </section>
  )
}

export const TextArea = styled.textarea`
  padding: 0.6rem;
  font-size: 110%;
  width: 25rem;
  height: 10rem;
  border: 2px solid var(--color);
  margin-right: 2rem;
`

export const EvaluationValue = styled.div`
  background: var(--color);
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  small {
    margin-bottom: 0.4rem;
  }
`
