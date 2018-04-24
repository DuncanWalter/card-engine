import type { Action } from "./action"
import type { ActionResolver } from "./actionResolver"
import type { GameState } from "../game/battle/battleState"
import { synchronize } from "../utils/async"

export type Header<ActionType=Action<>> = {
    actors?: any[],
    subjects?: any[],
    tags?: Symbol[],
    filter?: (action: Action<>) => boolean,
    type?: Symbol,
}

export type ListenerGroup = Listener<> 
                          | Iterable<ListenerGroup> 
                          | { listener: ListenerGroup }

export interface ConsumerArgs<Data=any, Subject=any, Actor=any> {
    data: Data,
    subject: Subject,
    actors: Set<Actor>,
    resolver: ActionResolver,
    action: Action<mixed, mixed, mixed>,
    next: () => Promise<void>,
    cancel: () => void,
    game: $ReadOnly<GameState>,
    internal: () => Promise<void>,
}

export type Consumer<Data=any, Subject=any, Actor=any> = (
    (args: ConsumerArgs<Data, Subject, Actor>) => void
)|(
    (args: ConsumerArgs<Data, Subject, Actor>) => Generator<Promise<any>, void, any>
)

export class Listener<Data=any, Subject=any, Actor=any>{

    id: Symbol
    internal: Symbol
    consumer: (args: ConsumerArgs<Data, Subject, Actor>) => Promise<void>
    header: Header<>

    constructor(id: Symbol, header: Header<>, consumer: Consumer<Data, Subject, Actor>, isWrapper: boolean){
        this.header = header,
        this.consumer = synchronize(consumer)
        if (!isWrapper) this.id = id
        if ( isWrapper) this.internal = id
    }
}

export const reject: Header<> = {
    filter: a => false
}

const deaf = Symbol('deaf')
export const deafListener: Listener<any, any, any> = new Listener(deaf, { type: deaf }, () => {}, false)