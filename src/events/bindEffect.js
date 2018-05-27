import type { Card } from "../cards/card"
import type { Event } from "./event"
import type { Effect, EffectState } from "../effects/effect"
import type { Creature } from "../creatures/creature"
import { defineEvent } from "./event"
import { ConsumerArgs } from "./listener"

type Type = {
    data: {
        Effect: (stacks: number) => Effect<any>,
        stacks: number,
    },
    subject: Card<> | Creature<>,
}

export const BindEffect = defineEvent('bindEffect', function*({ subject, data }: ConsumerArgs<Type>){
    
    let type = (new data.Effect(1)).type
    let current = [...subject.effects].filter(effect => effect.type == type)
    let effect: Effect<any> = current[0]
    // TODO: verify that floor is symmetric
    let stacks = Math.floor(data.stacks)

    if(current.length){
        effect.stacks += stacks
        // TODO: FIGURE OUT HOW TO USE EFFECTS ELEGANTLY HERE
        // effect.stacks = Math.min(effect.stackBehavior.max, effect.stacks)
        if(effect.stacks <= 0){ // effect.stackBehavior.min){
            subject.effects.remove(effect)
        }
    } else {
        let effect: Effect<any> = new data.Effect(stacks)
        subject.effects.add(effect)
    }

})
