import { defineCard, Card, PlayArgs, CardState, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { queryEnemy, upgrade } from './../utils'
import { Creature } from '../../creatures/creature'
import { Interrupt } from '../status/interupt'
import { AddToDiscardPile } from '../../events/addToDiscardPile'

type SideChannelData = BasicCardData & { damage: number }

export const SideChannel = defineCard(
  'SideChannel',
  playSideChannel,
  {
    energy: 0,
    damage: 9,
  },
  {
    color: '#aa8822',
    title: 'Side Channel',
    text: 'Deal #{damage} damage. Add an #[Interrupt] to the discard pile.',
  }
)

function* playSideChannel(
  self: Card<SideChannelData>,
  { game, resolver, actors, energy }: PlayArgs
) {
  let target = yield queryEnemy(game)

  const action = new Damage(
    actors,
    target,
    {
      damage: self.data.damage,
    },
    targeted,
    blockable
  )
  yield resolver.processEvent(action)

  const generate = new AddToDiscardPile(actors, new Interrupt(), {})
  yield resolver.processEvent(generate)

  return { damage: action.data.damage, energy }
}

export const SideChannelR = upgrade('R', SideChannel, { damage: 12 })
// export const SideChannelL = upgrade('L', SideChannel, { energy: 1 })
