import { MetaAction, Action } from './action'

import type { CA } from '../actions/action'
import type { Creature } from '../creatures/creature'

type Data = { damage: number }

export const targeted = Symbol('targeted')
export const damage = Symbol('damage')
export const Damage: CA<Data, Creature> = MetaAction(damage, ({ data, subject, cancel }: *) => { 
    data.damage = Math.floor(data.damage)
    if(data.damage <= 0){
        cancel()
        return
    } else {
        subject.health -= data.damage
    }
})




