import { MetaEffect, Effect, tick } from "./effect"
import { damage } from "../actions/damage"
import { Block, block } from "./block"
import { bindEffect } from "../actions/bindEffect"
import { Card } from "../cards/card"
import type { Listeners } from "../actions/actionResolver"

export const blockade = Symbol('blockade');
export const Blockade: Class<Effect> = MetaEffect(blockade, false, x => x, (owner, self) => ({
    id: blockade,
    header: {
        subjects: [owner],
        tags: [tick, block],
        type: bindEffect,
    },
    consumer({ data, actor, cancel }){
        if(data.stacks < 0){
            cancel()
        }
    },
}), [], [bindEffect])