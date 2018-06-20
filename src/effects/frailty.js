import { defineEffect, Effect } from './effect'
import { Damage, targeted } from '../events/damage'
import { Listener, ConsumerArgs } from '../events/listener'
import { BindEffect } from '../events/bindEffect'
import { Block } from './block'
import { Dexterity } from './dexterity'

export const Frailty: * = defineEffect(
  'frailty',
  {
    name: 'Frailty',
    innerColor: '#ee8866',
    outerColor: '#bb3322',
    description: 'Gain 25% less block from external sources.',
    sides: 3,
    rotation: 0.5,
  },
  {
    stacked: true,
    delta: (x) => x - 1,
    min: 1,
    max: 99,
  },
  (owner) => ({
    subjects: [owner],
    type: BindEffect,
    tags: [Block, targeted],
  }),
  (owner, type) =>
    function*({ data, actors, subject }) {
      if (typeof data.stacks == 'number') {
        data.stacks *= 0.75
      }
    },
  [Dexterity],
  [BindEffect]
)
