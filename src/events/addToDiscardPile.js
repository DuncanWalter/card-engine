import type { Event } from './event'
import type { Card } from '../cards/card'
// import type { Player } from '../creatures/player'
import { defineEvent } from './event'
import { Creature } from '../creatures/creature'
import { ConsumerArgs } from './listener'

type Type = {
  data: {},
  subject: Card<>,
}

export const AddToDiscardPile = defineEvent('addToDiscardPile', function*({
  subject,
  resolver,
  game,
}: ConsumerArgs<Type>) {
  game.discardPile.push(subject)
})
