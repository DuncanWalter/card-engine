import type { ListenerGroup } from './listener'
import type { Consumer } from './listener'
import type { Entity } from '../utils/entity'
import type { EventType, Subject, Data } from './listener'
import { Listener, reject } from './listener'
import { EventResolver, resolver } from './eventResolver'

export const startTurn = Symbol('startTurn')
export const startCombat = Symbol('startCombat')
export const endTurn = Symbol('endTurn')

function any(any: any): any { return any }

export class Event<T=any> extends Listener<T> {
    id: Symbol
    actors: Set<Entity<any>>
    subject: Subject<T>
    tags: Symbol[]
    data: Data<T>
    defaultListeners: Listener<>[]

    constructor(id: Symbol, consumer: Consumer<T>, actor: Entity<any> | Set<Entity<any>>, subject: Subject<T>, data: Data<T>, ...tags: Symbol[]){
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

export function defineEvent<T>(id: Symbol, consumer: Consumer<T>): (actors: Set<Entity<any>> | Entity<any>, subject: Subject<T>, data: Data<T>, ...tags: Symbol[]) => Event<T> {
    resolver.registerListenerType(id)
    return function(actors, subject, data){
        return new Event(id, consumer, actors, subject, data)
    }
}




// export class Action<Data=any, Subject=any, Actor=any> extends Listener<> {
//     id: Symbol
//     actors: Set<Actor>
//     subject: Subject
//     tags: Symbol[]
//     data: Data
//     defaultListeners: Listener<>[]

//     hasActorOfType(Type: Function){
//         return [...this.actors].reduce((acc, actor) => acc || actor instanceof Type, false)
//     }
    
//     constructor(id: Symbol, consumer: Consumer<>, actor: Actor | Set<Actor>, subject: Subject, data: Data, ...tags: Symbol[]){
//         super(id, reject, consumer, false)
//         this.data = data
//         this.subject = subject
//         this.tags = tags
//         this.defaultListeners = []

//         if(actor instanceof Set){
//             this.actors = actor
//         } else {
//             this.actors = new Set()
//             this.actors.add(actor)
//         }
//     }
// }

// export type () => Event<> = Class<CA<Data, Subject, Actor>>
// export function defineEvent<Data, Subject: Entity<any>, Actor: Entity<any> | Set<Entity<any>>>(
//     id: Symbol, 
//     consumer: Consumer<>,
// ): Class<CA<Data, Subject, Actor>> {
//     resolver.registerListenerType(id)
//     return any(class CustomAction extends Action<Data, Subject, Actor> {

//         id: Symbol
//         actors: Set<Actor>
//         subject: Subject
//         tags: Symbol[]
//         data: Data

//         constructor(actor: Actor | Set<Actor>, subject: Subject, data: Data, ...tags: Symbol[]){
//             super(id, consumer, actor, subject, data, id, ...tags)
//         }
//     })
// } 



