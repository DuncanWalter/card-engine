import type { CustomAction } from "./action"
import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { ConsumerArgs } from "./listener";
import { ReclaimDiscardPile } from "./reclaimDiscardPile";
import { AddToHand } from "./addToHand";

type Data = {
    count: number,
}


export const drawCards = Symbol('drawCards')
export const DrawCards: CustomAction<Data> = MetaAction(drawCards, function*({ actors, subject, resolver, data, game }: ConsumerArgs<Data>): * { 
    // TODO: is this how I want to do max hand size?
    while(data.count-- && game.discardPile.size + game.drawPile.size){
        if(!game.drawPile.size){
            resolver.processAction(new ReclaimDiscardPile({}, {}, {}))
        }
        yield resolver.processAction(new AddToHand(actors, ...game.drawPile.take(1), {}))
    }
})