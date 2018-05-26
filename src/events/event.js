import type { ListenerGroup, ListenerType } from './listener'
import type { Consumer } from './listener'
import type { Entity } from '../utils/entity'
import type { EventContent, Subject, Data } from './listener'
import type { Creature } from '../creatures/creature'
import { Listener, reject } from './listener'
import { EventResolver, resolver } from './eventResolver'

export const startTurn: ListenerType<{ subject: Creature<>, data: any }> = any('startTurn')
export const startCombat: ListenerType<{ subject: Creature<>, data: any }> = any('startCombat')
export const endTurn: ListenerType<{ subject: Creature<>, data: any }> = any('endTurn')

function any(any: any): any { return any }

export type Tag = { type: ListenerType<any> } | string | ListenerType<any>

export class Event<T:EventContent> extends Listener<T> {
    id: ListenerType<T>
    actors: Set<Entity<any>>
    subject: Subject<T>
    tags: string[]
    data: Data<T>
    defaultListeners: Listener<any>[]

    constructor(id: ListenerType<T>, consumer: Consumer<T>, actor: Entity<any> | Set<Entity<any>>, subject: Subject<T>, data: Data<T>, ...tags: Tag[]){
        super(id, reject, consumer, false)
        this.data = data
        this.subject = subject
        this.defaultListeners = []
        this.tags = tags.map(tag => {
            if(typeof tag == 'string'){
                return tag
            } else {
                return tag.type
            }
        })

        if(actor instanceof Set){
            this.actors = actor
        } else {
            this.actors = new Set()
            this.actors.add(actor)
        }
    }
}

export type EventDefinition<T:EventContent> = { type: ListenerType<T> } & (actor: Set<Entity<any>> | Entity<any>, subject: Subject<T>, data: Data<T>, ...tags: Tag[]) => Event<T>

export function defineEvent<T:EventContent>(type: string, consumer: Consumer<T>): EventDefinition<T> {
    
    const eventType = resolver.registerListenerType(type)
    
    let factory = function(actors, subject, data, ...tags){
        return new Event(eventType, consumer, actors, subject, data, ...tags)
    }

    factory.type = eventType
    return factory
    
}




