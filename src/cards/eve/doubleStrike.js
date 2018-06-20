import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'

type DoubleStrikeData = BasicCardData & { damage: number }

export const doubleStrike = 'doubleStrike'
export const DoubleStrike: () => Card<DoubleStrikeData> = defineCard(
  doubleStrike,
  playDoubleStrike,
  {
    energy: 1,
    damage: 5,
  },
  {
    color: '#dd4466',
    title: 'Double Strike',
    text: 'Deal #{damage} damage twice.',
  }
)

function* playDoubleStrike(
  self: Card<DoubleStrikeData>,
  { game, resolver, actors, energy }: PlayArgs
): Generator<any, DoubleStrikeData, any> {
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
  return { damage: action.data.damage, energy }
}
