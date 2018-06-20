import { defineEffect, Effect } from './effect'
import { Damage, targeted } from '../events/damage'
import { Block } from './block'
import { BindEffect } from '../events/bindEffect'
import { Card } from '../cards/card'
import { ConsumerArgs, Listener } from '../events/listener'

export const Dexterity: * = defineEffect(
  'dexterity',
  {
    name: 'Dexterity',
    outerColor: '#22aa88',
    innerColor: '#115544',
    description: '',
    sides: 30,
    rotation: 0,
  },
  {
    stacked: true,
    delta: (x) => x,
    min: 1,
    max: 99,
  },
  (owner) => ({
    subjects: [owner],
    filter: (action) => action.data.Effect == Block,
    type: BindEffect,
    tags: [targeted],
  }),
  (owner, type) =>
    function*({ data, actors }) {
      if (data.stacks >= 0) {
        data.stacks += owner.stacksOf(type)
      }
    },
  [],
  [BindEffect]
)
