import type { Event } from "./event"
import { defineEvent } from "./event"
import { Creature } from "../creatures/creature"
import { ConsumerArgs } from "./listener";
import { ReclaimDiscardPile } from "./reclaimDiscardPile";
import { AddToHand } from "./addToHand";
import { Player } from "../creatures/player";

type Type = {
    data: {
        count: number,
    },
    subject: Player,
}


export const drawCards = 'drawCards'
export const DrawCards = defineEvent(drawCards, function*({ actors, subject, resolver, data, game }: ConsumerArgs<Type>): * { 
    while(data.count-- && game.discardPile.size + game.drawPile.size){
        if(!game.drawPile.size){
            yield resolver.processEvent(new ReclaimDiscardPile(actors, game.player, {}, drawCards))
        }
        yield resolver.processEvent(new AddToHand(actors, game.drawPile.pop(), {}, drawCards))
    }
})