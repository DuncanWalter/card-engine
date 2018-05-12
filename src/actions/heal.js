import type { CustomAction } from '../actions/action'
import type { CreatureWrapper } from '../creatures/creature'
import { MetaAction, Action } from './action'
import { ConsumerArgs } from './listener';

type Data = { healing: number }

export const heal: Symbol = Symbol('heal')
export const Heal: CustomAction<Data, CreatureWrapper<>> = MetaAction(heal, ({ data, subject, cancel }: ConsumerArgs<Data, CreatureWrapper<>>): * => { 
    data.healing = Math.floor(data.healing)
    if(data.healing <= 0){
        cancel()
        return
    } else {
        subject.health += data.healing
    }
})




