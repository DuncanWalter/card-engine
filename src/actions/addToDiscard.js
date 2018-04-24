import type { CustomAction } from "./action"
import type { Card } from "../cards/card";
import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { ConsumerArgs } from "./listener";
import { ReclaimDiscardPile } from "./reclaimDiscardPile";

type Data = {}

export const addToDiscardPile = Symbol('addToDiscardPile')
export const AddToDiscardPile: CustomAction<Data, Card<>> = MetaAction(addToDiscardPile, ({ actor, subject, resolver, data, game }: ConsumerArgs<Data, Card<>>) => { 
    game.discardPile.addToTop(subject)
})