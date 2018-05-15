import type { Effect } from "../effects/effect"
import type { Card } from "../cards/card";
import type { Event } from "./event"
import { defineEvent } from "./event"
import { Creature } from "../creatures/creature"
import { ConsumerArgs } from "./listener";

type Type = {
    data: {
        Effect: Class<Effect>,
        stacks: number,
    },
    subject: Card<> | Creature<>,
}

export const bindEffect: Symbol = Symbol('bindEffect')
export const BindEffect = defineEvent(bindEffect, function*({ subject, data }: ConsumerArgs<Type>){
    let effect: Effect, current = subject.effects.filter(e => e.constructor == data.Effect)
    let stacks = Math.floor(data.stacks)
    if(current.length){
        effect = current[0]
        effect.stacks += stacks
        effect.stacks = Math.min(effect.stackBehavior.max, effect.stacks)
        if(effect.stacks < effect.stackBehavior.min){
            let index = subject.effects.indexOf(effect)
            subject.effects.splice(index, 1)
        }
    } else {
        effect = new data.Effect(subject, stacks)
        subject.effects.push(effect)
    }
})
