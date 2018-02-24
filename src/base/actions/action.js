import { construct } from './../../utility/construct'

import type { ActionResolver } from './actionResolver'

export interface Action<Actor, Subject, Type> {
    id: Symbol,
    actor: Subject,
    subject: Actor,
    tags: Array<string>,
    consumer(args: ConsumerArgs<Actor, Subject, Type>): void,
};

export interface ConsumerArgs<Actor, Subject, Type> {
    action: Type,
    subject: Subject,
    actor: Actor,
    resolver: ActionResolver,
    next: () => void,
    cancel: () => void,
};





