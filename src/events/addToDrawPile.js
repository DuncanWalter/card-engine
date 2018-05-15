import type { Event } from "./event"
import type { Card } from "../cards/card";
import { defineEvent } from "./event"
import { Creature } from "../creatures/creature"
import { ConsumerArgs } from "./listener";

type Type = {
    data: {},
    subject: Card<>,
}

export const addToDrawPile = Symbol('addToDrawPile')
export const AddToDrawPile = defineEvent(addToDrawPile, function*({ actor, subject, resolver, data, game }: ConsumerArgs<Type>){ 
    game.drawPile.addToTop(subject)
    // TODO: don't want to shuffle the whole thing
    game.drawPile.shuffle()
})