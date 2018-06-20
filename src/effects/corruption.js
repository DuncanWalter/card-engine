import { defineEffect, Effect, tick } from './effect'
import { Damage } from '../events/damage'
import { Vulnerability } from './vulnerability'
import { BindEffect } from '../events/bindEffect'
import { Listener, ConsumerArgs } from '../events/listener'

export const Corruption: * = defineEffect(
  'corruption',
  {
    name: 'Corruption',
    outerColor: '#332233',
    innerColor: '#661166',
    description:
      'On start turn, take #{stacks} damage and add 1 #[Corruption].',
    sides: 6,
  },
  {
    stacked: true,
    delta: (x) => x + 1,
    min: 1,
    max: 999,
  },
  (owner) => ({
    subjects: [owner],
    tags: [tick, Corruption],
    type: BindEffect,
  }),
  (owner, type) =>
    function*({ resolver, subject, cancel }: ConsumerArgs<>) {
      yield resolver.processEvent(
        new Damage(
          self,
          subject,
          {
            damage: owner.stacksOf(type),
          },
          Corruption
        )
      )
    },
  [tick],
  []
)
