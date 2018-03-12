import type { CustomAction } from "./action"
import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"

type Data = {
    count: number,
}


export const drawCard = Symbol('drawCard')
export const DrawCard: CustomAction<Data> = MetaAction(drawCard, ({ subject, resolver, data, game }: *) => { 
    // TODO: is this how I want to do max hand size?
    while(data.count-- && game.hand.length < 10 && game.discardPile.length + game.drawPile.length){
        if(!game.drawPile.length){
            game.drawPile.splice(0, 0, ...game.discardPile.splice(0, game.discardPile.length))
        }
        game.hand.splice(
            0,
            0,
            game.drawPile.splice(Math.floor(Math.random()*game.drawPile.length), 1)[0],
        )
    }
})