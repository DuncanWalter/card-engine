import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import type { Card } from '../cards/card'
import { defineEvent } from './event'
import { ConsumerArgs } from './listener'
import { CardStack } from '../cards/cardStack'

interface Type {
  +data: {};
  +subject: Card<>;
}

export const RemoveCard = defineEvent('removeCard', function*({
  game,
  subject,
}: ConsumerArgs<Type>) {
  game.deck.remove(subject)
})
