import { MetaEffect, Effect } from "./effect"
import { damage } from "../actions/damage"
import { vulnerability } from "./vulnerability"
import { BindEffect } from "../actions/bindEffect"
import { gameSlice } from "../gameState"
import type { Listeners } from "../actions/actionResolver"

export const blockable = Symbol('blockable')
export const block = Symbol('block')
export const Block: Class<Effect> = MetaEffect(block, true, x => 0, (owner, self) => ({
    id: block,
    header: {
        subjects: [owner],
        tags: [blockable],
    },
    consumer({ data, resolver, actor, cancel }: *){
        if (resolver.simulating) return
        if(typeof data.damage == 'number'){
            if(data.damage <= self.stacks){
                resolver.processAction(new BindEffect(actor, owner, {
                    Effect: Block,
                    stacks: -data.damage,
                }))
                data.damage = 0
                cancel()
            } else {
                data.damage -= self.stacks
                resolver.processAction(new BindEffect(actor, owner, {
                    Effect: Block,
                    stacks: -self.stacks,
                }))
            }
        } else {
            cancel()
        }
    },  
}), [vulnerability], [damage])