import type { Event } from "./event"
import { defineEvent } from "./event"
import { Creature } from "../creatures/creature"
import { ConsumerArgs } from "./listener";


export const reclaimDiscardPile = Symbol('reclaimDiscardPile')
export const ReclaimDiscardPile = defineEvent(reclaimDiscardPile, function*({ resolver, game }){ 
    game.drawPile.add(...game.discardPile)
    game.discardPile.clear()
})