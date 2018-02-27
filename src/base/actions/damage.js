import { MetaAction, Action } from './action'

import type { CA } from '../actions/action'
import type { Creature } from '../creatures/creature'

type Data = { damage: number }

export const targeted = Symbol('targeted')
export const damage = Symbol('damage')
export const Damage: CA<Data, Creature> = MetaAction(damage, ({ data, subject, cancel }: *) => { 
    if(data.damage <= 0){
        cancel()
    } else {
        subject.health -= data.damage
    }
})




