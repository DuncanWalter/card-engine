import type { CustomAction } from "./action"
import type { ConsumerArgs } from "./listener"
import type { NPC } from "../creatures/npc"

import { MetaAction } from "./action"
import { EndTurn } from "./turnActions"
import { bind } from "../components/battle/battleState"

export const setupCombat: Symbol = Symbol('setupCombat')
export const SetupCombat: CustomAction<NPC[]> = MetaAction(setupCombat, function({ game, resolver, data }: ConsumerArgs<NPC[]>): void { 
    
    game.drawPile.clear()
    game.hand.clear()
    game.discardPile.clear()
    game.exhaustPile.clear()
    game.activeCards.clear()
    

    bind(game => {
        game.enemies = data
        return game
    })

})