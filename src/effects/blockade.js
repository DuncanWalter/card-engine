import type { ListenerGroup } from '../events/listener'
import { defineEffect, Effect, tick } from './effect'
import { Damage } from '../events/damage'
import { Block } from './block'
import { BindEffect } from '../events/bindEffect'
import { Card } from '../cards/card'
import { Listener, ConsumerArgs } from '../events/listener'
import { Creature } from '../creatures/creature'

export const Blockade: * = defineEffect(
  'blockade',
  {
    name: 'Blockade',
    innerColor: '#2233bb',
    outerColor: '#6688ee',
    description: 'On turn start, retain stacks of #[Block].',
    sides: 30,
    rotation: 0,
  },
  {
    stacked: false,
    delta: (x) => x,
    min: 1,
    max: 1,
  },
  (owner) => ({
    subjects: [owner],
    tags: [tick, Block],
    type: BindEffect,
  }),
  (owner, type) =>
    function*({ data, actor, cancel }) {
      if (data.stacks < 0) {
        cancel()
      }
    },
  [],
  [BindEffect]
)
