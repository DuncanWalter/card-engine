import { defineCard, Card, PlayArgs, CardState, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { queryEnemy, upgrade } from './../utils'
import { Creature } from '../../creatures/creature'

type StrikeData = BasicCardData & { damage: number }

export const Strike: () => Card<StrikeData> = defineCard(
  'Strike',
  playStrike,
  {
    energy: 1,
    damage: 6,
  },
  {
    color: '#dd2244',
    title: 'Strike',
    text: 'Deal #{damage} damage.',
  }
)

function* playStrike(
  self: Card<StrikeData>,
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

  return { damage: action.data.damage, energy }
}

export const StrikeR = upgrade('R', Strike, { damage: 9 })
export const StrikeL = upgrade('L', Strike, { energy: 0 })
