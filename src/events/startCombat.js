import type { Event } from './event'
import type { ConsumerArgs } from './listener'
import { defineEvent } from './event'
import { StartTurn } from './turnActions'

export const StartCombat = defineEvent('startCombat', function*({
  game,
  resolver,
}) {
  game.drawPile.add(...game.deck.deepClone())
  game.drawPile.shuffle(game.player.seed)
  resolver.enqueueEvents(
    new StartTurn(game.player, game.player, {}, StartCombat)
  )
})
