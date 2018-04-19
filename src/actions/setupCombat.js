import type { CustomAction } from "./action"
import type { ConsumerArgs } from "./listener"
import type { NPC } from "../creatures/npc"

import { MetaAction } from "./action"
import { EndTurn } from "./turnActions"

export const setupCombat: Symbol = Symbol('setupCombat')
export const SetupCombat: CustomAction<NPC[]> = MetaAction(setupCombat, function({ game, resolver, data }: ConsumerArgs<NPC[]>): void { 
    
    game.drawPile.clear()
    game.hand.clear()
    game.discardPile.clear()
    game.exhaustPile.clear()
    game.activeCards.clear()
    game.player.effects.splice(0,  game.player.effects.length)
    game.enemies = data

    return game

})