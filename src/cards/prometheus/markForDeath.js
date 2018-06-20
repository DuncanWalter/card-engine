import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { BindEffect } from '../../events/bindEffect'
import { Vulnerability } from '../../effects/vulnerability'

type MarkForDeathData = BasicCardData & { taunt: number, vulnerability: number }

export const markForDeath = 'markForDeath'
export const MarkForDeath: () => Card<MarkForDeathData> = defineCard(
  markForDeath,
  playMarkForDeath,
  {
    taunt: 1,
    vulnerability: 1,
    energy: 0,
  },
  {
    color: '#dd2244',
    title: 'MarkForDeath',
    text: 'Apply #{taunt} #[taunt] and #{vulnerability} #[vulnerability].',
  }
)

function* playMarkForDeath(
  self: Card<MarkForDeathData>,
  { game, resolver, actors, energy }: PlayArgs
): Generator<any, MarkForDeathData, any> {
  // TODO: query creature
  let target = yield queryEnemy(game)
  // yield resolver.processEvent(new BindEffect(actors, target, {
  //     Effect: Taunt,
  //     stacks: self.data.taunt,
  // }))
  yield resolver.processEvent(
    new BindEffect(actors, target, {
      Effect: Vulnerability,
      stacks: self.data.vulnerability,
    })
  )
  return {
    taunt: self.data.taunt,
    vulnerability: self.data.vulnerability,
    energy,
  }
}
