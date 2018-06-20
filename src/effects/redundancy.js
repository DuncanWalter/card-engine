import type { ListenerGroup } from '../events/listener'
import { defineEffect, Effect, tick, defineCompoundEffect } from './effect'
import { Damage, blockable } from '../events/damage'
import { Vulnerability } from './vulnerability'
import { BindEffect } from '../events/bindEffect'
import { Listener, ConsumerArgs } from '../events/listener'
import { Block } from './block'
import { defineListener } from '../events/defineListener'
import { Creature } from '../creatures/creature'

const redundancy = 'redundancy'

const RedundancyDrain: * = defineEffect(
  'redundancyDrain',
  null,
  {
    stacked: true,
    delta: (x) => 0,
    min: 1,
    max: 999,
  },
  (owner) => ({
    subjects: [owner],
    tags: [RedundancyDrain, tick],
    type: BindEffect,
  }),
  (owner, type) =>
    function*({ resolver, actors, subject }) {
      yield resolver.processEvent(
        new BindEffect(actors, subject, {
          Effect: Redundancy,
          stacks: -owner.stacksOf(type),
        })
      )
    },
  [],
  [BindEffect]
)

export const RedundancyRD: * = defineListener(
  'redundancyReduceDamage',
  (owner) => ({
    subjects: [owner],
    tags: [blockable],
    type: Damage,
  }),
  (owner, type) =>
    function*({ data, resolver, actors, cancel }: ConsumerArgs<>) {
      if (typeof data.damage == 'number') {
        // TODO: do this properly
        data.damage = Math.min(
          reducedDamage(data.damage, owner.stacksOf(redundancy)),
          data.damage
        )
      } else {
        throw new Error('Damage event has ill formated data')
      }
    },
  [Vulnerability],
  [Block]
)

export const RedundancySD: * = defineListener(
  'redundancyScheduleDrain',
  (owner) => ({
    subjects: [owner],
    tags: [blockable],
    type: Damage,
  }),
  (owner: Creature<>) =>
    function*({ data, resolver, actors, cancel }: ConsumerArgs<>) {
      yield resolver.processEvent(
        new BindEffect(actors, owner, {
          Effect: RedundancyDrain,
          stacks: reducedDamage(data.damage, owner.health),
        })
      )
    },
  [Damage]
)

export const Redundancy: * = defineCompoundEffect(
  redundancy,
  {
    name: 'Redundancy',
    innerColor: '#77bb22',
    outerColor: '#225511',
    description:
      'Reduce incoming damage. Upon taking damage, lose stack of redundancy.',
    sides: 5,
    rotation: 0.5,
  },
  {
    stacked: true,
    delta: (x) => x,
    min: 1,
    max: 999,
  },
  RedundancyRD,
  RedundancySD
)

// My favorite armor equation- works for all positive armor and damage,
// high damage attacks are more efficient, etc.
function reducedDamage(damage: number, armor: number): number {
  return Math.max(1, Math.floor((damage * damage) / (damage + armor)))
}
