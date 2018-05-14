import type { CustomAction } from '../actions/action'
import type { Creature } from '../creatures/creature'
import { MetaAction, Action } from './action'
import { ConsumerArgs } from './listener'

type Data = { points: number }

export const bindMaxHp: Symbol = Symbol('bindMaxHp')
export const BindMaxHp: CustomAction<Data, Creature<>> = MetaAction(bindMaxHp, ({ data, subject, cancel }: ConsumerArgs<Data, Creature<>>): * => { 
    subject.health += Math.floor(data.points)
    subject.inner.data.maxHealth += Math.floor(data.points)
})




