import { MetaEffect, Effect, tick } from "./effect"
import { damage, Damage } from "../actions/damage"
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from "../actions/bindEffect"
import { gameSlice } from "../gameState"
import { playCard, PlayCard } from "../actions/playCard";
import { ConsumerArgs } from "../actions/action";
import type { Listeners } from "../actions/actionResolver"

export const exhaust = Symbol('poison')
export const Exhaust: Class<Effect> = MetaEffect(exhaust, false, x => x, (owner, self) => ({
    id: exhaust,
    header: {
        subjects: [owner],
        type: playCard,
    },
    consumer({ game, data }: ConsumerArgs<>){
        data.destination = game.exhaustPile
    },  
}), [], [playCard])