import type { Event } from "./event"
import type { EventResolver } from "./eventResolver"
import type { Game } from "../game/battle/battleState"
import type { Player } from "../creatures/player"
import { synchronize } from "../utils/async"
import { Entity } from "../utils/entity"

export type Header = {
    actors?: any[],
    subjects?: any[],
    tags?: string[],
    filter?: (event: Event<EventType>) => boolean,
    type?: string,
}

export interface EventType {
    +subject: Entity<any>,
    +data: Object,
}

export type Subject<+T> = $PropertyType<$ReadOnly<T>, 'subject'>

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

export type Consumer<T:EventType> = (args: ConsumerArgs<T>) => Generator<Promise<any>, void, any>

export class Listener<T:EventType>{

    id: string
    internal: string
    consumer: (args: ConsumerArgs<T>) => Promise<void>
    header: Header

    constructor(id: string, header: Header, consumer: Consumer<T>, isWrapper: boolean){
        this.header = header,
        this.consumer = synchronize(consumer)
        if (!isWrapper) this.id = id
        if ( isWrapper) this.internal = id
    }
}

export const reject: Header = { filter: a => false }
export const deafListener: Listener<any> = new Listener('DEAF_LISTENER', reject, function*(){}, false)