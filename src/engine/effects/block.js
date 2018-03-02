import { MetaEffect, Effect } from "./effect"
import { damage } from "../actions/damage"
import { vulnerable } from "./vulnerable"
import { BindEffect } from "../actions/bindEffect"
import { gameState } from "../gameState"
import type { Listeners } from "../actions/actionResolver"

export const blockable = Symbol('blockable')
export const block = Symbol('block')
export const Block: Class<Effect> = MetaEffect(block, true, 0, (owner, self) => ({
    id: block,
    header: {
        subjects: [owner],
        tags: [blockable],
    },
    consumer({ data, resolver, actor, cancel }: *){
        if(typeof data.damage == 'number'){
            if(data.damage <= self.stacks){
                resolver.processAction(new BindEffect(actor, owner, {
                    effect: block,
                    stacks: -data.damage,
                }))
                data.damage = 0
                cancel()
            } else {
                data.damage -= self.stacks
                resolver.processAction(new BindEffect(actor, owner, {
                    effect: block,
                    stacks: -self.stacks,
                }))
            }
        } else {
            cancel()
        }
    },  
}))

gameState.resolver.registerListenerType(block, [vulnerable], [damage])