import type { ListenerGroup, ConsumerArgs } from '../events/listener'
import { defineEffect, Effect, tick } from './effect'
import { Damage } from '../events/damage'
import { Vulnerability } from './vulnerability'
import { BindEffect } from '../events/bindEffect'
import { PlayCard } from '../events/playCard'
import { Listener } from '../events/listener'
import { AddToDiscardPile } from '../events/addToDiscardPile'
import { Card } from '../cards/card'
import { AddToDrawPile } from '../events/addToDrawPile'

export const Default: * = defineEffect(
  'default',
  {
    name: 'Default',
    innerColor: '#343434',
    outerColor: '#565656',
    description: 'On play, add to draw pile instead of discard pile.',
    sides: 30,
  },
  {
    stacked: false,
    delta: (x) => x,
    min: 1,
    max: 1,
  },
  (owner) => ({
    subjects: [owner],
    type: AddToDiscardPile,
    tags: [PlayCard],
  }),
  (owner, type) =>
    function*({ game, data, resolver, cancel }: ConsumerArgs<>): * {
      if (owner instanceof Card) {
        yield resolver.processEvent(new AddToDrawPile(self, owner, {}))
        return cancel()
      }
    },
  [],
  [AddToDiscardPile]
)
