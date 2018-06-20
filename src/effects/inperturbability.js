import { defineEffect, Effect } from './effect'
import { Damage } from '../events/damage'
import { Listener, ConsumerArgs } from '../events/listener'
import { Vulnerability } from './vulnerability'
import { BindEffect } from '../events/bindEffect'

export const Imperturbability: * = defineEffect(
  'imperturbability',
  null,
  {
    stacked: false,
    delta: (x) => x,
    min: 1,
    max: 1,
  },
  (owner) => ({
    subjects: [owner],
    type: BindEffect,
  }),
  (owner, type) =>
    function*({ cancel }) {
      cancel()
    },
  [Vulnerability],
  [BindEffect]
)
