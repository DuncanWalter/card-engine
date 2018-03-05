import { ActionResolver } from './actionResolver'
import { gameSlice, GameState } from '../gameState'

import type { Listener } from './actionResolver'

// TODO: Make the Consumer args take game state (importing it feels dirty)


export const startTurn = Symbol('startTurn')
export const startCombat = Symbol('startCombat')
export const endTurn = Symbol('endTurn')


export type CA<Data=any, Subject=any, Actor=any> = Class<Action<Data, Subject, Actor>>

export class Action<Data=any, Subject=any, Actor=any> {
    id: Symbol
    actor: Actor
    subject: Subject
    tags: Symbol[]
    data: Data
    defaultListeners: Listener<>[]
    consumer: (args: ConsumerArgs<Data, Subject, Actor>) => void
    constructor(actor: Actor, subject: Subject, data: Data, ...tags: Symbol[]){
        this.data = data
        this.actor = actor
        this.subject = subject
        this.tags = tags
        this.defaultListeners = []
    }
}

export interface ConsumerArgs<Data=any, Subject=any, Actor=any> {
    data: Data,
    subject: Subject,
    actor: Actor,
    resolver: ActionResolver,
    next: () => void,
    cancel: () => void,
    game: $ReadOnly<GameState>,
    internal: () => void,
}

export function MetaAction<Data, Subject, Actor>(
    id: Symbol, 
    consumer: (args: ConsumerArgs<Data, Subject, Actor>) => void,
): Class<Action<Data, Subject, Actor>> {
    gameSlice.resolver.registerListenerType(id)
    return class CustomAction extends Action<Data, Subject, Actor> {

        id: Symbol = id
        actor: Actor
        subject: Subject
        tags: Symbol[]
        data: Data

        consumer: (args: ConsumerArgs<Data, Subject, Actor>) => void = consumer

        constructor(actor: Actor, subject: Subject, data: Data, ...tags: Symbol[]){
            super(actor, subject, data, id, ...tags)
        }
    }
} 



