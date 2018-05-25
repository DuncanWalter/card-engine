import type { ListenerGroup } from './listener'
import type { Consumer } from './listener'
import type { Entity } from '../utils/entity'
import type { EventContent, Subject, Data } from './listener'
import { Listener, reject } from './listener'
import { EventResolver, resolver } from './eventResolver'

export const startTurn = 'startTurn'
export const startCombat = 'startCombat'
export const endTurn = 'endTurn'

function any(any: any): any { return any }

export class Event<T:EventContent> extends Listener<T> {
    id: string
    actors: Set<Entity<any>>
    subject: Subject<T>
    tags: string[]
    data: Data<T>
    defaultListeners: Listener<any>[]

    constructor(id: string, consumer: Consumer<T>, actor: Entity<any> | Set<Entity<any>>, subject: Subject<T>, data: Data<T>, ...tags: string[]){
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

export function defineEvent<T:EventContent>(id: string, consumer: Consumer<T>): (actors: Set<Entity<any>> | Entity<any>, subject: Subject<T>, data: Data<T>, ...tags: string[]) => Event<T> {
    resolver.registerListenerType(id)
    return function(actors, subject, data, ...tags){
        return new Event(id, consumer, actors, subject, data, ...tags)
    }
}




// export class Action<Data=any, Subject=any, Actor=any> extends Listener<> {
//     id: string
//     actors: Set<Actor>
//     subject: Subject
//     tags: string[]
//     data: Data
//     defaultListeners: Listener<>[]

//     hasActorOfType(Type: Function){
//         return [...this.actors].reduce((acc, actor) => acc || actor instanceof Type, false)
//     }
    
//     constructor(id: string, consumer: Consumer<>, actor: Actor | Set<Actor>, subject: Subject, data: Data, ...tags: string[]){
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
//     id: string, 
//     consumer: Consumer<>,
// ): Class<CA<Data, Subject, Actor>> {
//     resolver.registerListenerType(id)
//     return any(class CustomAction extends Action<Data, Subject, Actor> {

//         id: string
//         actors: Set<Actor>
//         subject: Subject
//         tags: string[]
//         data: Data

//         constructor(actor: Actor | Set<Actor>, subject: Subject, data: Data, ...tags: string[]){
//             super(id, consumer, actor, subject, data, id, ...tags)
//         }
//     })
// } 



