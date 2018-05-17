import type { Event } from "./event"
import type { EventResolver } from "./eventResolver"
import type { Game } from "../game/battle/battleState"
import type { Player } from "../creatures/player"
import { synchronize } from "../utils/async"
import { Entity } from "../utils/entity"

export type Header = {
    actors?: any[],
    subjects?: any[],
    tags?: Symbol[],
    filter?: (event: Event<>) => boolean,
    type?: Symbol,
}

export interface EventType {
    subject: Entity<any>,
    data: Object,
}


export type Subject<T> = $PropertyType<T, 'subject'>

export type Data<T> = $PropertyType<T, 'data'>

export type ListenerGroup = Listener<> 
                          | Iterable<ListenerGroup> 
                          | { listener: ListenerGroup }

export interface ConsumerArgs<T=any> {
    data: Data<T>,
    subject: Subject<T>,
    actors: Set<Entity<any>>,
    resolver: EventResolver,
    event: Event<T>,
    next: () => Promise<void>,
    cancel: () => void,
    game: Game,
    internal: () => Promise<void>,
}

export type Consumer<T=any> = (args: ConsumerArgs<T>) => Generator<Promise<any>, void, any>


export class Listener<T=any>{

    id: Symbol
    internal: Symbol
    consumer: (args: ConsumerArgs<T>) => Promise<void>
    header: Header

    constructor(id: Symbol, header: Header, consumer: Consumer<T>, isWrapper: boolean){
        this.header = header,
        this.consumer = synchronize(consumer)
        if (!isWrapper) this.id = id
        if ( isWrapper) this.internal = id
    }
}

const deaf = Symbol('deaf')
export const reject: Header = { filter: a => false }
export const deafListener: Listener<any> = new Listener(deaf, reject, function*(){}, false)
