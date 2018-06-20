import type { BehaviorState } from '../behavior'
import { Behavior, defineBehavior, primeBehavior } from '../behavior'
import { Damage, targeted, blockable } from '../../events/damage'
import { Block } from '../../effects/block'
import { BindEffect } from '../../events/bindEffect'
import { StartCombat } from '../../events/startCombat'
import { Blockade } from '../../effects/blockade'
import { Listener } from '../../events/listener'
import { Corruption } from '../../effects/corruption'
import { Latency } from '../../effects/latency'
import { defineMonster } from '../monster'

const bite: BehaviorState = defineBehavior('Cobra Bite', function*({
  owner,
  resolver,
  game,
}) {
  let action: Damage = new Damage(
    owner,
    game.player,
    {
      damage: 9,
    },
    targeted,
    blockable
  )
  // deals poison on-hit
  action.defaultListeners.push(
    new Listener(
      Damage.type,
      {},
      function*({ data, resolver, actors, subject, internal }) {
        yield internal()
        // TODO: this might not cancel properly...
        yield resolver.processEvent(
          new BindEffect(actors, subject, {
            Effect: Corruption,
            stacks: 1,
          })
        )
      },
      true
    )
  )
  yield resolver.processEvent(action)
  return { damage: action.data.damage, isDebuffing: true }
})

const hiss: BehaviorState = defineBehavior('Cobra Hiss', function*({
  owner,
  resolver,
  game,
}) {
  yield resolver.processEvent(
    new BindEffect(owner, game.player, {
      Effect: Latency,
      stacks: 2,
    })
  )
  return { isDebuffing: true }
})

function behaviorSwitch(last, seed) {
  switch (true) {
    case last == primeBehavior: {
      return seed.next() > 0.35 ? bite : hiss
    }
    case last == bite: {
      return seed.next() > 0.35 ? hiss : bite
    }
    case last == hiss: {
      return bite
    }
    default: {
      return bite
    }
  }
}

export const Cobra = defineMonster('Cobra', 30, behaviorSwitch)
