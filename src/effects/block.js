import type { ListenerGroup } from '../events/listener'
import { defineEffect, Effect } from './effect'
import { Damage, blockable } from '../events/damage'
import { Vulnerability } from './vulnerability'
import { BindEffect } from '../events/bindEffect'
import { Listener, ConsumerArgs } from '../events/listener'

export const Block: * = defineEffect(
  'block',
  {
    name: 'Block',
    innerColor: '#6688ee',
    outerColor: '#2233bb',
    description:
      'Until the start of your next turn, avoid the next #{stacks} damage you would take.',
    sides: 5,
    rotation: 0.5,
  },
  {
    stacked: true,
    delta: (x) => 0,
    min: 1,
    max: 999,
  },
  (owner) => ({
    subjects: [owner],
    tags: [blockable],
    type: Damage,
  }),
  (owner, type) =>
    function*({ data, resolver, actors, cancel }) {
      if (resolver.simulating) return
      if (typeof data.damage == 'number') {
        if (data.damage <= owner.stacksOf(type)) {
          resolver.processEvent(
            new BindEffect(
              actors,
              owner,
              {
                Effect: Block,
                stacks: -data.damage,
              },
              Block
            )
          )
          data.damage = 0
          cancel()
        } else {
          data.damage -= owner.stacksOf(type)
          resolver.processEvent(
            new BindEffect(
              actors,
              owner,
              {
                Effect: Block,
                stacks: -owner.stacksOf(type),
              },
              Block
            )
          )
        }
      } else {
        cancel()
      }
    },
  [Vulnerability],
  [Damage]
)
