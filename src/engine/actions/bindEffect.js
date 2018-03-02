import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import { effects } from "../effects/effect"
import type { CA } from "./action"

type Data = {
    effect: Symbol,
    stacks: number,
}

export const bindEffect = Symbol('bindEffect')
export const BindEffect: CA<Data, Creature> = MetaAction(bindEffect, ({ subject, data }: *) => {
    let effect, current = subject.effects.filter(e => e.id == data.effect)
    if(current.length){
        effect = current[0]
        effect.stacks += data.stacks
        if(effect.stacks <= 0 && effect.stacked){
            let index = subject.effects.indexOf(effect)
            subject.effects.splice(index, 1)
        }
    } else {
        let Constructor = effects.get(data.effect)
        if(Constructor){
            effect = new Constructor(subject, data.stacks)
            subject.effects.push(effect)
        } else {
            throw new Error(`Attempted to bind unknown Effect type ${data.effect.toString()}`)
        }
    }
})
