import { MetaEffect, Effect, tick } from "./effect"
import { damage, Damage } from "../actions/damage"
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from "../actions/bindEffect"
import { gameSlice } from "../gameState"
import type { Listeners } from "../actions/actionResolver"

export const poison = Symbol('poison')
export const Poison: Class<Effect> = MetaEffect(poison, true, x => x - 1, (owner, self) => ({
    id: poison,
    header: {
        subjects: [owner],
        tags: [tick, poison],
        type: bindEffect,
    },
    consumer({ resolver, subject, cancel }: *){
        resolver.pushActions(new Damage({}, subject, {
            damage: self.stacks,
        }, poison))
    },  
}), [tick], [])