import { defineCard, PlayArgs, Card, BasicCardData } from '../card'
import { queryEnemy } from '../utils'
import { BindEffect } from '../../events/bindEffect'
import { Frailty } from '../../effects/frailty'
import { Monster } from '../../creatures/monster'
import { Event } from '../../events/event'

type ExposeData = BasicCardData & { frailty: number, area: boolean }

// like blind or trip, but w/ frailty
export const Expose = defineCard(
  'expose',
  playExpose,
  {
    energy: 0,
    area: false,
    frailty: 3,
  },
  {
    color: '#aabbee',
    title: 'Expose',

    text: 'Apply #{frailty} #[Frailty].',
  }
)

function* playExpose(
  self: Card<ExposeData>,
  { game, energy, actors, resolver }: PlayArgs
) {
  const target: Monster = yield queryEnemy(game)
  const binding = new BindEffect(actors, target, {
    Effect: Frailty,
    stacks: self.data.frailty,
  })
  yield resolver.processEvent(binding)
  return {
    ...self.data,
    energy,
    frailty: binding.data.stacks,
  }
}
