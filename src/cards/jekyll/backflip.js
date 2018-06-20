import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../events/damage'
import { DrawCards } from '../../events/drawCards'

type BackflipData = BasicCardData & { block: number, draw: number }

export const backflip = 'backflip'
export const Backflip: () => Card<BackflipData> = defineCard(
  backflip,
  playBackflip,
  {
    block: 5,
    energy: 1,
    draw: 2,
  },
  {
    color: '#223399',
    title: 'Backflip',
    text: 'Gain #{block} block. Draw #{draw} cards.',
  }
)

function* playBackflip(
  self: Card<BackflipData>,
  { actors, game, resolver, energy }: PlayArgs
): Generator<any, BackflipData, any> {
  const action = yield resolver.processEvent(
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
  yield resolver.processEvent(
    new DrawCards(actors, game.player, {
      count: self.data.draw,
    })
  )
  return {
    ...self.data,
    block: action.data.stacks,
    energy: energy,
    draw: self.data.draw,
  }
}
