import type { Event } from './event'
import type { Card } from '../cards/card'
import { defineEvent } from './event'
import { Creature } from '../creatures/creature'
import { ConsumerArgs } from './listener'
import { AddToDiscardPile } from './addToDiscardPile'

type Type = {
  data: {},
  subject: Card<>,
}

export const AddToHand = defineEvent('addToHand', function* addToHand({
  actors,
  subject,
  resolver,
  data,
  game,
}: ConsumerArgs<Type>) {
  if (game.hand.size < 10) {
    game.hand.push(subject)
  } else {
    yield resolver.processEvent(new AddToDiscardPile(actors, subject, data))
  }
})
