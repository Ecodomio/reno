import { compute } from './Aide'
import { Key } from './ExplicationUI'
import rules from '@/app/règles/rules'

export default function Value({
  state,
  engine,
  evaluation: givenEvaluation,
  name,
  display = (v) => v,
}) {
  const evaluation = givenEvaluation || compute(name, engine, rules)
  return (
    <Key $state={state || (evaluation.hasMissing ? 'inProgress' : 'final')}>
      {display(evaluation.node.nodeValue)}
    </Key>
  )
}
