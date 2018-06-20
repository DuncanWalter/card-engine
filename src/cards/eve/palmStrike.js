import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { DrawCards } from '../../events/drawCards'

type PalmStrikeData = BasicCardData & { damage: number, draw: number }

export const palmStrike = 'palmStrike'
export const PalmStrike: () => Card<PalmStrikeData> = defineCard(
  palmStrike,
  playPalmStrike,
  {
    energy: 1,
    damage: 9,
    draw: 1,
  },
  {
    color: '#ee4422',
    title: 'Palm Strike',
    text: 'Deal #{damage} damage. Draw #{draw} cards.',
  }
)

function* playPalmStrike(
  self: Card<PalmStrikeData>,
  { energy, game, resolver, actors }: PlayArgs
): Generator<any, PalmStrikeData, any> {
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
  yield resolver.processEvent(
    new DrawCards(actors, game.player, { count: self.data.draw })
  )
  return { damage: action.data.damage, energy, draw: self.data.draw }
}
