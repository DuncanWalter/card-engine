import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { DrawCards } from '../../events/drawCards'

type FlashOfSteelData = BasicCardData & { damage: number }

export const flashOfSteel = 'flashOfSteel'
export const FlashOfSteel: () => Card<FlashOfSteelData> = defineCard(
  flashOfSteel,
  playFlashOfSteel,
  {
    energy: 0,
    damage: 4,
  },
  {
    color: '#cccc44',
    title: 'Flash Of Steel',
    text: 'Deal #{damage} damage. Draw a card.',
  }
)

function* playFlashOfSteel(
  self: Card<FlashOfSteelData>,
  { resolver, actors, game, energy }: PlayArgs
): Generator<any, FlashOfSteelData, any> {
  let target = yield queryEnemy(game)
  const action: Damage = yield resolver.processEvent(
    new Damage(
      actors,
      target,
      {
        damage: self.data.damage,
      },
      targeted,
      blockable
    )
  )
  yield resolver.processEvent(new DrawCards(actors, game.player, { count: 1 }))
  return { damage: action.data.damage, energy }
}
