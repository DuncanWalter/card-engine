import type { ListenerGroup } from './listener'
import type { Consumer } from './listener'
import { Listener, reject } from './listener'
import { ActionResolver } from './actionResolver'
import { gameSlice, GameState } from '../gameState'


export const startTurn = Symbol('startTurn')
export const startCombat = Symbol('startCombat')
export const endTurn = Symbol('endTurn')

function any(any: any): any { return any }

export class Action<Data=any, Subject=any, Actor=any> extends Listener<> {
    id: Symbol
    actor: Actor
    subject: Subject
    tags: Symbol[]
    data: Data
    defaultListeners: Listener<>[]
    
    constructor(id: Symbol, consumer: Consumer<>, actor: Actor, subject: Subject, data: Data, ...tags: Symbol[]){
        super(id, reject, consumer, false)
        this.data = data
        this.actor = actor
        this.subject = subject
        this.tags = tags
        this.defaultListeners = []
    }
}






export type CustomAction<Data=any, Subject=any, Actor=any> = Class<CA<Data, Subject, Actor>>
export function MetaAction<Data, Subject, Actor>(
    id: Symbol, 
    consumer: Consumer<>,
): Class<CA<Data, Subject, Actor>> {
    gameSlice.state.resolver.registerListenerType(id)
    return any(class CustomAction extends Action<Data, Subject, Actor> {

        id: Symbol
        actor: Actor
        subject: Subject
        tags: Symbol[]
        data: Data

        constructor(actor: Actor, subject: Subject, data: Data, ...tags: Symbol[]){
            super(id, consumer, actor, subject, data, id, ...tags)
        }
    })
} 



