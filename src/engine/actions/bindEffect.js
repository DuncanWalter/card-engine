import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import type { Effect } from "../effects/effect"
import type { Card } from "../cards/card";
import type { CA } from "./action"

type Data = {
    Effect: Class<Effect>,
    stacks: number,
}

export const bindEffect = Symbol('bindEffect')
export const BindEffect: CA<Data, Creature | Card<any>> = MetaAction(bindEffect, ({ subject, data }: *) => {
    let effect, current = subject.effects.filter(e => e.constructor == data.Effect)
    if(current.length){
        effect = current[0]
        effect.stacks += data.stacks
        if(effect.stacks <= 0 && effect.stacked){
            let index = subject.effects.indexOf(effect)
            subject.effects.splice(index, 1)
        }
    } else {
        effect = new data.Effect(subject, data.stacks)
        subject.effects.push(effect)
    }
})
