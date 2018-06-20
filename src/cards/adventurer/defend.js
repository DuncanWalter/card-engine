import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../events/damage'
import { upgrade } from '../utils'

type DefendData = BasicCardData & { block: number }

export const Defend: () => Card<DefendData> = defineCard(
  'Defend',
  playDefend,
  {
    block: 4,
    energy: 1,
    playable: true,
  },
  {
    color: '#223399',
    title: 'Defend',
    text: 'Gain #{block} block.',
  }
)

function* playDefend(
  self: Card<DefendData>,
  { actors, game, resolver, energy }: PlayArgs
) {
  const action: BindEffect = yield resolver.processEvent(
    new BindEffect(
      actors,
      game.player,
      {
        Effect: Block,
        stacks: self.data.block,
      },
      Block,
      targeted
    )
  )
  return {
    block: action.data.stacks,
    playable: true,
    energy,
  }
}

export const DefendL = upgrade('L', Defend, { energy: 0 })
export const DefendR = upgrade('R', Defend, { block: 7 })
