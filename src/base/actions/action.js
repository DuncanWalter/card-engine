import { construct } from './../../utility/construct'

import { ActionResolver } from './actionResolver'

export type ActionT = {
    // TODO: id
    actor: any,
    subject: any,
    tags: Array<string>,
};

type Consumer = ({
    action: ActionT,
    subject: any,
    actor: any,
    resolver: ActionResolver,
}) => void;

const actionProto = {
    consumer: (__) => { 
        throw Error('Action consumer called without override.'); 
    },
    actor: [],
    subject: [],
};

export function Action(consumer: Consumer, actor: mixed, subject: mixed, ...tags: Array<string>): ActionT{
    return construct(actionProto, { 
        consumer, 
        actor, 
        subject, 
        tags, 
    });
};





