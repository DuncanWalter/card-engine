import type { Event } from "./event"
import type { Card } from "../cards/card";
// import type { Player } from '../creatures/player'
import { defineEvent } from "./event"
import { Creature } from "../creatures/creature"
import { ConsumerArgs } from "./listener";
import { ReclaimDiscardPile } from "./reclaimDiscardPile";

type Type = {
    data: {},
    subject: Card<>,
}

export const addToDiscardPile = Symbol('addToDiscardPile')
export const AddToDiscardPile = defineEvent(addToDiscardPile, function*({ subject, resolver, game }: ConsumerArgs<Type>){ 
    game.discardPile.addToTop(subject)
})