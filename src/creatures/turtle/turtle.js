import type { BehaviorState } from '../behavior'
import { Behavior, defineBehavior, primeBehavior } from '../behavior'
import { Damage, targeted, blockable } from '../../events/damage'
import { Block } from '../../effects/block'
import { BindEffect } from '../../events/bindEffect'
import { Blockade } from '../../effects/blockade'
import { defineMonster } from '../monster'

const chomp: BehaviorState = defineBehavior('Turtle Chomp', function*({
  owner,
  resolver,
  game,
}) {
  const action: Damage = yield resolver.processEvent(
    new Damage(
      self,
      game.player,
      {
        damage: 7,
      },
      targeted,
      blockable
    )
  )
  return { damage: action.data.damage }
})

const hunker: BehaviorState = defineBehavior('Turtle Hunker', function*({
  owner,
  resolver,
  game,
}) {
  yield resolver.processEvent(
    new BindEffect(owner, owner, {
      Effect: Block,
      stacks: 8,
    })
  )
  return { isDefending: true }
})

function behaviorSwitch(last, seed) {
  switch (true) {
    case last == primeBehavior: {
      return seed.next() > 0.35 ? chomp : hunker
    }
    case last == chomp: {
      return seed.next() > 0.35 ? hunker : chomp
    }
    case last == hunker: {
      return chomp
    }
    default: {
      return chomp
    }
  }
}

// TODO: unify all ids
export const Turtle = defineMonster(
  'Turtle',
  15,
  behaviorSwitch,
  (self, seed) => {
    self.effects.push(Blockade(1), Block(25))
    return self
  }
)
