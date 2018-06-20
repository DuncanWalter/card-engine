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

// TODO: make number of times played visible using the Rampage stacks effect

type RampageData = BasicCardData & { damage: number, scaling: number }

// TODO: Upgrades either increase scaling or provide Default or start with a stack of cache

export const rampage = 'rampage'
export const Rampage: () => Card<RampageData> = defineCard(
  rampage,
  playRampage,
  {
    energy: 1,
    damage: 7,
    scaling: 5,
  },
  {
    color: '#ff9944',
    title: 'Rampage',
    text:
      'Deal #{damage} damage. Gain 1 #[Cache]. Deals #{scaling} more damage for each #[Cache]',
  }
)

function* playRampage(
  self: Card<RampageData>,
  { game, resolver, actors, energy }: PlayArgs
): Generator<any, RampageData, any> {
  let target = yield queryEnemy(game)
  const action: Damage = yield resolver.processEvent(
    new Damage(
      actors,
      target,
      {
        damage: self.data.damage + self.stacksOf(Cache) * self.data.scaling,
      },
      targeted,
      blockable
    )
  )
  yield resolver.processEvent(
    new BindEffect(actors, self, {
      Effect: Cache,
      stacks: 1,
    })
  )
  return {
    damage: action.data.damage,
    energy,
    scaling: self.data.scaling,
  }
}
