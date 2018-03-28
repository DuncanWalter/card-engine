import type { CustomAction } from "./action"
import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { ConsumerArgs } from "./listener";
import { ReclaimDiscardPile } from "./reclaimDiscardPile";

type Data = {
    count: number,
}


export const drawCard = Symbol('drawCard')
export const DrawCard: CustomAction<Data> = MetaAction(drawCard, ({ subject, resolver, data, game }: ConsumerArgs<Data>) => { 
    // TODO: is this how I want to do max hand size?
    while(data.count-- && game.hand.size < 10 && game.discardPile.size + game.drawPile.size){
        if(!game.drawPile.size){
            resolver.processAction(new ReclaimDiscardPile({}, {}, {}))
        }
        game.hand.addToTop(...game.drawPile.take(1))
    }
})