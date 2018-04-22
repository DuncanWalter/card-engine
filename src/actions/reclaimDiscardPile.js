import type { CustomAction } from "./action"
import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { ConsumerArgs } from "./listener";


export const reclaimDiscardPile = Symbol('reclaimDiscardPile')
export const ReclaimDiscardPile: CustomAction<{}> = MetaAction(reclaimDiscardPile, ({ resolver, game }: ConsumerArgs<{}>): void => { 
    game.drawPile.add(...game.discardPile.takeAll())
})