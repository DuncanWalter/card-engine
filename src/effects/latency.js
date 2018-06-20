import { defineEffect, Effect } from './effect'
import { Damage } from '../events/damage'
import { Listener, ConsumerArgs } from '../events/listener'
import { blockable } from '../events/damage'
import { Vulnerability } from './vulnerability'
import { Card } from '../cards/card'
import { EndTurn } from '../events/turnActions'

export const Latency: * = defineEffect(
  'latency',
  {
    name: 'Latency',
    innerColor: '#22ee33',
    outerColor: '#119922',
    description: 'Deal 25% less damage for #{stacks} turns.',
    sides: 3,
    rotation: 0.5,
  },
  {
    stacked: true,
    delta: (x) => x - 1,
    min: 1,
    max: 99,
    on: EndTurn,
  },
  (owner) => ({
    filter: (action) => action.actors.has(owner),
    tags: [blockable],
    type: Damage,
  }),
  (owner, type) =>
    function*({ data }) {
      if (typeof data.damage == 'number') {
        data.damage *= 0.75
      }
    },
  [],
  [Vulnerability]
)
