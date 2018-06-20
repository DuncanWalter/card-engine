import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { AddToDiscardPile } from '../../events/addToDiscardPile'
import { Volatile } from '../../effects/volatile'
import { Monster } from '../../creatures/monster'
import { Cache } from './cache'
import { defineEvent } from '../../events/event'

type CrackData = BasicCardData & { damage: number }

export const crack = 'crack'
export const Crack: () => Card<CrackData> = defineCard(
  crack,
  playCrack,
  {
    energy: 0,
    damage: 4,
  },
  {
    color: '#ee4422',
    title: 'Crack',
    text:
      'Deal #{damage} damage. All cards with #[Cache] deal 1 additional damage per stack of #[Cache]. #[Cache].',
  },
  [Cache, 1]
)

function* playCrack(
  self,
  { resolver, game, actors, energy }: PlayArgs
): Generator<any, CrackData, any> {
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

  yield resolver.processEvent(new BoostCache(actors, game.player, {}))

  return { damage: action.data.damage, energy }
}

const BoostCache = defineEvent('boostCache', function*({ game }) {
  ;[
    ...game.hand,
    ...game.drawPile,
    ...game.discardPile,
    ...game.activeCards,
  ].forEach((card) => {
    if (card.stacksOf(Cache)) {
      if ('damage' in card.data === true) {
        // $FlowFixMe
        card.data.damage += card.stacksOf(Cache)
      }
    }
  })
})
