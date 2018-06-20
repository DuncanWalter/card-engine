import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import type { Card } from '../cards/card'
import { defineEvent } from './event'
import { ConsumerArgs } from './listener'
import { CardStack } from '../cards/cardStack'

type Type = {
  data: {
    from?: CardStack,
  },
  subject: Card<>,
}

export const Discard = defineEvent('discard', function*({
  data,
  game,
  subject,
  cancel,
}: ConsumerArgs<Type>) {
  if (data.from) {
    data.from.remove(subject)
  }

  game.discardPile.add(subject)
})
