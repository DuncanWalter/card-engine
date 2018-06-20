import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'

type TripleStrikeData = BasicCardData & { damage: number }

export const tripleStrike = 'tripleStrike'
export const TripleStrike: () => Card<TripleStrikeData> = defineCard(
  tripleStrike,
  playTripleStrike,
  {
    energy: 1,
    damage: 4,
  },
  {
    color: '#dd6688',
    title: 'Triple Strike',
    text: 'Deal #{damage} damage thrice.',
  }
)

function* playTripleStrike(
  self: Card<TripleStrikeData>,
  { game, resolver, actors, energy }: PlayArgs
): Generator<any, TripleStrikeData, any> {
  let target = yield queryEnemy(game)
  if (target && target instanceof Creature) {
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
  } else {
    return self.data
  }
}
