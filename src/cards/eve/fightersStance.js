import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../events/damage'
import { AddToHand } from '../../events/addToHand'
import { Jab } from './jab'

type FightersStanceData = BasicCardData & { block: number, jabs: number }

export const fightersStance = 'fightersStance'
export const FightersStance: () => Card<FightersStanceData> = defineCard(
  fightersStance,
  playFightersStance,
  {
    block: 6,
    energy: 1,
    jabs: 1,
  },
  {
    color: '#551199',
    title: "Fighter's Stance",
    text: 'Gain #{block} block. Add #{jabs} #[Jab] to your hand.',
  }
)

function* playFightersStance(
  self: Card<FightersStanceData>,
  { actors, game, resolver, energy }: PlayArgs
): Generator<any, FightersStanceData, any> {
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
  let i = self.data.jabs
  while (i-- > 0) {
    yield resolver.processEvent(new AddToHand(actors, new Jab(), {}))
  }
  return { block: action.data.stacks, energy, jabs: self.data.jabs }
}
