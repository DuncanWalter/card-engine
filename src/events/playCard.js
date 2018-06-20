import type { Card } from '../cards/card'
import type { Event } from './event'
import type { CardStack } from '../cards/cardStack'
import { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { Player } from '../creatures/player'
import { ConsumerArgs } from './listener'
import { BindEnergy } from './bindEnergy'
import { AddToDiscardPile } from './addToDiscardPile'

type Type = {
  data: {
    from?: CardStack,
  },
  subject: Card<>,
}

export const PlayCard = defineEvent('playCard', function*({
  game,
  data,
  subject,
  actors,
  resolver,
  cancel,
}: ConsumerArgs<Type>) {
  let energy: number
  if (subject.data.energy === undefined) {
    return cancel()
  } else if (subject.data.energy === 'X') {
    if (!game.player.energy) {
      return cancel()
    } else {
      energy = game.player.energy
    }
  } else {
    if (game.player.energy < subject.data.energy) {
      return cancel()
    } else {
      energy = subject.data.energy
    }
  }

  if (data.from) {
    data.from.remove(subject)
    game.activeCards.push(subject) // TODO: could be safer than push pop
  }

  yield resolver.processEvent(
    new BindEnergy(
      actors,
      game.player,
      {
        quantity: -energy,
      },
      PlayCard
    )
  )

  actors.add(subject)

  yield subject.play({
    resolver,
    actors,
    game,
    energy,
  })

  let card: Card<> = subject
  let event = yield resolver.processEvent(
    new AddToDiscardPile(actors, card, {}, PlayCard)
  )

  if (data.from) {
    game.activeCards.remove(subject)
  }
})
