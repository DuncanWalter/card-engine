import type { CustomAction } from "./action"
import type { ConsumerArgs } from "./listener"
import type { NPC } from "../creatures/npc"
import { MetaAction } from "./action"
import { EndTurn } from "./turnActions"
import { Sequence } from "../utils/random";

interface Data {
    enemies: NPC[],
    seed: Sequence,
}

export const setupCombat: Symbol = Symbol('setupCombat')
export const SetupCombat: CustomAction<Data> = MetaAction(setupCombat, function({ game, resolver, data }: ConsumerArgs<Data>): void { 
    
    game.drawPile.clear()
    game.hand.clear()
    game.discardPile.clear()
    game.exhaustPile.clear()
    game.activeCards.clear()
    game.player.effects.splice(0,  game.player.effects.length)
    game.enemies = data.enemies
    game.seed = data.seed.fork()

    return game

})