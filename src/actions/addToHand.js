import type { CustomAction } from "./action"
import type { Card } from "../cards/card";
import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { ConsumerArgs } from "./listener";
import { ReclaimDiscardPile } from "./reclaimDiscardPile";
import { AddToDiscardPile } from "./addToDiscard";

type Data = {}


export const addToHand = Symbol('addToHand')
export const AddToHand: CustomAction<Data, Card<>> = MetaAction(addToHand, function* addToHand({ actors, subject, resolver, data, game }: ConsumerArgs<Data, Card<>>): * { 
    // TODO: is this how I want to do max hand size?
    if(game.hand.size < 10){
        game.hand.addToTop(subject)
    } else {
        yield resolver.processAction(new AddToDiscardPile(actors, subject, data))
    }
})