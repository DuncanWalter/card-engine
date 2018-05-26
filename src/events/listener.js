import type { EventResolver } from "./eventResolver"
import type { Game } from "../game/battle/battleState"
import type { Player } from "../creatures/player"
import type { EventDefinition, Tag, Event } from "./event";
import { synchronize } from "../utils/async"
import { Entity } from "../utils/entity"

export interface EventContent {
    +subject: Entity<any>,
    +data: Object,
}

// TODO: major refactor including define listener function
export opaque type ListenerType<T:EventContent>: string = string

export type Header<T:EventContent> = {
    actors?: Entity<any>[],
    subjects?: Subject<T>[],
    tags?: Tag[],
    filter?: (event: Event<T>) => boolean,
    type?: { type: ListenerType<any> } | ListenerType<any> | string, // TODO: Event Type
}

export type Subject<T> = $PropertyType<T, 'subject'>

export type Data<T> = $PropertyType<T, 'data'>

export type ListenerGroup = Listener<any> 
                          | Iterable<ListenerGroup> 
                          | { +listener: ListenerGroup }

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

export type Consumer<T:EventContent> = (args: ConsumerArgs<T>) => Generator<Promise<any>, void, any>

// TODO: give owner and self types?
export class Listener<T:EventContent>{

    id: ListenerType<T>
    internal: ListenerType<T>
    consumer: (args: ConsumerArgs<T>) => Promise<void>
    header: Header<T>

    constructor(id: ListenerType<T>, header: Header<T>, consumer: Consumer<T>, isWrapper: boolean){
        this.header = header,
        this.consumer = synchronize(consumer)
        if (!isWrapper) this.id = id
        if ( isWrapper) this.internal = id
    }
}

export const reject: Header<any> = { filter: a => false }
export const deafListener: Listener<any> = new Listener('DEAF_LISTENER', reject, function*(){}, false)
