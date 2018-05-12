import type { ListenerGroup } from './listener'
import type { Consumer } from './listener'
import { Listener, reject } from './listener'
import { ActionResolver, resolver } from './actionResolver'

export const startTurn = Symbol('startTurn')
export const startCombat = Symbol('startCombat')
export const endTurn = Symbol('endTurn')

function any(any: any): any { return any }

export class Action<Data=any, Subject=any, Actor=any> extends Listener<> {
    id: Symbol
    actors: Set<Actor>
    subject: Subject
    tags: Symbol[]
    data: Data
    defaultListeners: Listener<>[]

    hasActorOfType(Type: Function){
        return [...this.actors].reduce((acc, actor) => acc || actor instanceof Type, false)
    }
    
    constructor(id: Symbol, consumer: Consumer<>, actor: Actor | Set<Actor>, subject: Subject, data: Data, ...tags: Symbol[]){
        super(id, reject, consumer, false)
        this.data = data
        this.subject = subject
        this.tags = tags
        this.defaultListeners = []

        if(actor instanceof Set){
            this.actors = actor
        } else {
            this.actors = new Set()
            this.actors.add(actor)
        }
    }
}

export type CustomAction<Data=any, Subject=any, Actor=any> = Class<CA<Data, Subject, Actor>>
export function MetaAction<Data, Subject, Actor>(
    id: Symbol, 
    consumer: Consumer<>,
): Class<CA<Data, Subject, Actor>> {
    resolver.registerListenerType(id)
    return any(class CustomAction extends Action<Data, Subject, Actor> {

        id: Symbol
        actors: Set<Actor>
        subject: Subject
        tags: Symbol[]
        data: Data

        constructor(actor: Actor | Set<Actor>, subject: Subject, data: Data, ...tags: Symbol[]){
            super(id, consumer, actor, subject, data, id, ...tags)
        }
    })
} 



