import type { CustomAction } from '../actions/action'
import type { CreatureWrapper } from '../creatures/creature'
import { MetaAction, Action } from './action'
import { ConsumerArgs } from './listener'

type Data = { damage: number }

export const blockable = Symbol('blockable')
export const targeted: Symbol = Symbol('targeted')
export const damage: Symbol = Symbol('damage')
export const Damage: CustomAction<Data, CreatureWrapper<>> = MetaAction(damage, function*({ data, subject, cancel }: ConsumerArgs<Data, CreatureWrapper<>>): * { 
    data.damage = Math.floor(data.damage)
    if(data.damage <= 0){
        cancel()
        return
    } else {
        subject.health -= data.damage
        yield new Promise(resolve => setTimeout(resolve, 100))
    }
})




