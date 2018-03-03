import { MetaEffect, Effect } from "./effect"
import { gameSlice } from "../gameState"
import { damage } from "../actions/damage"
import type { Listeners } from "../actions/actionResolver"

export const vulnerable = Symbol('vulnerable');
export const Vulnerable: Class<Effect> = MetaEffect(vulnerable, true, -1, owner => ({
    id: vulnerable,
    header: {
        subjects: [owner],
        tags: [damage],
    },
    consumer({ data }){
        if(typeof data.damage == 'number'){
            data.damage *= 1.5
        }
    },  
}))

gameSlice.resolver.registerListenerType(vulnerable, [], [damage])