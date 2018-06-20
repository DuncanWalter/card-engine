import { defineEffect, Effect } from './effect'
import { Listener, ConsumerArgs } from '../events/listener'
import { blockable, Damage } from '../events/damage'
import { Latency } from './latency'
import { Card } from '../cards/card'

export const Strength: * = defineEffect(
  'strength',
  {
    name: 'Strength',
    innerColor: '#ee4444',
    outerColor: '#aa3333',
    description: 'Deal #{stacks} addition damage from external sources.',
    sides: 3,
    rotation: 0,
  },
  {
    stacked: true,
    delta: (x) => x,
    min: 1,
    max: 99,
  },
  (owner) => ({
    actors: [owner],
    tags: [blockable],
    type: Damage,
  }),
  (owner, type) =>
    function*({ data }) {
      if (typeof data.damage == 'number') {
        data.damage += owner.stacksOf(type)
      }
    },
  [],
  [Latency]
)
