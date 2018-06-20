import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy, upgrade } from './../utils'
import { AddToDiscardPile } from '../../events/addToDiscardPile'
import { Volatile } from '../../effects/volatile'
import { Monster } from '../../creatures/monster'
import { Cache } from './cache'

type NeedleData = BasicCardData & { damage: number, onDraw: boolean }

// TODO: make it an upgrade to add cache etc

export const needle = 'needle'
export const Needle: () => Card<NeedleData> = defineCard(
  needle,
  playNeedle,
  {
    energy: 0,
    damage: 4,
    onDraw: false,
  },
  {
    color: '#ee4422',
    title: 'Needle',
    text:
      'Deal #{damage} damage. Add a copy of Needle to the discard pile. #[Volatile].',
  },
  [Volatile, 1]
)

function* playNeedle(
  self,
  { game, resolver, actors, energy }: PlayArgs
): Generator<any, NeedleData, any> {
  let target: Monster = yield queryEnemy(game)
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
  yield resolver.processEvent(new AddToDiscardPile(self, self.clone(), {}))
  return { ...self.data, damage: action.data.damage, energy }
}

export const NeedleWithCache = upgrade('R', Needle, {}, {}, (card) =>
  card.effects.push(Cache(1))
)
export const NeedleOnDraw = upgrade('R', Needle, { onDraw: true }, { text: '' })
// export const NeedleTriple = upgrade('L')
