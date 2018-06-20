import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { Dexterity } from '../../effects/dexterity'
import { Singleton } from '../../effects/singleton'

type FootworkData = BasicCardData & { dexterity: number }

export const footwork = 'footwork'
export const Footwork: () => Card<FootworkData> = defineCard(
  footwork,
  playFootwork,
  {
    dexterity: 2,
    energy: 1,
  },
  {
    energyTemplate: '#{energy}',
    color: '#228866',
    title: 'Footwork',
    text: 'Gain #{dexterity} dexterity. #[Singleton]',
  },
  [Singleton, 1]
)

function* playFootwork(
  self: Card<FootworkData>,
  { actors, game, resolver, energy }: PlayArgs
): Generator<any, FootworkData, any> {
  const action: BindEffect = yield resolver.processEvent(
    new BindEffect(
      actors,
      game.player,
      {
        Effect: Dexterity,
        stacks: self.data.dexterity,
      },
      Dexterity
    )
  )
  return { dexterity: action.data.stacks, energy, playable: true }
}
