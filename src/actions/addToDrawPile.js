import type { CustomAction } from "./action"
import type { Card } from "../cards/card";
import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { ConsumerArgs } from "./listener";

type Data = {}

export const addToDrawPile = Symbol('addToDrawPile')
export const AddToDrawPile: CustomAction<Data, Card<>> = MetaAction(addToDrawPile, ({ actor, subject, resolver, data, game }: ConsumerArgs<Data, Card<>>): void => { 
    game.drawPile.addToTop(subject)
    // TODO: don't want to shuffle the whole thing
    game.drawPile.shuffle()
})