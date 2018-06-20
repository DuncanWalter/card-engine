import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { DrawCards } from '../../events/drawCards'
import { defineEffect } from '../../effects/effect'
import { BindEffect } from '../../events/bindEffect'
import { deafListener, reject } from '../../events/listener'
import { Default } from '../../effects/default'
import { Cache } from './cache'

// TODO:
// cache cow - deal bla dmg. Dmg scales with stacks of cache in deck.
// -> deal dmg x times o random foes
// -> deal dmg to all foes, singleton

type DeduceData = BasicCardData & { scaling: number }

export const Deduce: () => Card<DeduceData> = defineCard(
  'deduce',
  playDeduce,
  {
    energy: 2,
    scaling: 5,
  },
  {
    color: '#ff8811',
    title: 'Deduce',
    text:
      'Deal #{damage} damage. Deals #{scaling} damage per #[Cache] in deck. #[Cache].',
  },
  [Cache, 1]
)

function* playDeduce(
  self: Card<DeduceData>,
  { resolver, actors, energy, game }: PlayArgs
): Generator<any, DeduceData, any> {
  let target = yield queryEnemy(game)

  const caches = [
    ...game.hand,
    ...game.discardPile,
    ...game.drawPile,
    ...game.activeCards,
  ].reduce((acc, card) => card.stacksOf(Cache) + acc, 0)

  const action = new Damage(
    actors,
    target,
    {
      damage: self.stacksOf(Cache) * self.data.scaling,
    },
    targeted,
    blockable
  )

  yield resolver.processEvent(action)

  return {
    damage: action.data.damage,
    energy,
    scaling: self.data.scaling,
  }
}
