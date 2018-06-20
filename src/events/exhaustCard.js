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

export const ExhaustCard = defineEvent('exhaustCard', function*({
  data,
  game,
  subject,
  cancel,
}: ConsumerArgs<Type>) {
  if (data.from) {
    data.from.remove(subject)
  }

  game.exhaustPile.add(subject)
})
