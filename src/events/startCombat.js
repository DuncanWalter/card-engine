import type { Event } from "./event"
import type { ConsumerArgs } from "./listener"
import { defineEvent, startCombat, startTurn } from "./event"
import { StartTurn } from "./turnActions"

export { startCombat }
export const StartCombat = defineEvent(startCombat, function*({ game, resolver }){ 
    
    game.drawPile.add(...game.deck.clone())
    game.drawPile.shuffle(game.player.seed)
    resolver.enqueueEvents(new StartTurn(game.player, game.player, {}, startCombat))

})