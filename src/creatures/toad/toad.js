import type { BehaviorState } from '../behavior'
import { Behavior, defineBehavior } from '../behavior'
import { Damage, targeted, blockable } from '../../events/damage'
import { Block } from '../../effects/block'
import { BindEffect } from '../../events/bindEffect'
import { Latency } from '../../effects/latency'
import { Strength } from '../../effects/strength'
import { defineMonster } from '../monster'
import { Sequence } from '../../utils/random'

const ribbit: BehaviorState = defineBehavior('Toad Ribbit', function*({
  owner,
  resolver,
  game,
}) {
  yield resolver.processEvent(
    new BindEffect(
      owner,
      owner,
      {
        stacks: 5,
        Effect: Block,
      },
      targeted
    )
  )
  yield resolver.processEvent(
    new BindEffect(
      owner,
      owner,
      {
        stacks: 1,
        Effect: Strength,
      },
      targeted
    )
  )
  return { defending: true, buffing: true }
})

const lick: BehaviorState = defineBehavior('Toad Lick', function*({
  owner,
  resolver,
  game,
}) {
  yield resolver.processEvent(
    new BindEffect(owner, game.player, {
      Effect: Latency,
      stacks: 1,
    })
  )
  return { isDebuffing: true }
})

const bite: BehaviorState = defineBehavior('Toad Bite', function*({
  owner,
  resolver,
  game,
}) {
  if (!resolver.simulating) console.log('biting', game)
  const action: Damage = yield resolver.processEvent(
    new Damage(
      owner,
      game.player,
      {
        damage: 6,
      },
      targeted,
      blockable
    )
  )
  return { damage: action.data.damage }
})

function next(last: BehaviorState, seed: Sequence<number>): BehaviorState {
  const next = seed.next()
  switch (true) {
    case next < 0.3333: {
      return ribbit
    }
    case next < 0.5555: {
      return lick
    }
    case next < 1.0: {
      return bite
    }
  }
  return bite
}

export const Toad = defineMonster('Toad', 15, next)
