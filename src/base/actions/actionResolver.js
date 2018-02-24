import { LL } from './../../utility/linkedList'

import type { Action } from './../actions/action'

type AnyAction = Action<any, any, AnyAction>

export class ActionResolver {

    processing: boolean
    simulating: boolean
    actionQueue: LL<AnyAction>

    constructor(listeners){
        this.processing = false;
        this.simulating = false;
        this.actionQueue = new LL();
    }

    enqueueAction(action: AnyAction){
        if (this.simulating) return;
        this.actionQueue.append(action);
        if (!this.processing) this.processQueue();
    }

    pushAction(action: AnyAction){
        if (this.simulating) return;
        this.actionQueue.push(action);
        if (!this.processing) this.processQueue();
    }

    processAction(action: AnyAction, simulate?: boolean){
        if (this.simulating && !simulate) return action;
        // const listeners = orderListeners(this.listeners.filter(l => {

        // }));
        // let index = -1;
        // let active = true;
        // const cancel = () => (active = false);
        // const next = () => {
        //     while(++index < listeners.length && active){
        //         listeners[index].consumer({ 
        //             action,
        //             next,
        //             cancel,
        //             resolver: this,
        //             subject: action.subject,
        //             actor: action.actor,
        //         });
        //     }
        // };
        // next();
        console.log('action',  action, action.constructor, action.constructor.name);
        action.consumer({ 
            action,
            resolver: this,
            subject: action.subject,
            actor: action.actor,
            next: () => undefined,
            cancel: () => undefined,
        });
        return action;
    }

    simulateAction(action: AnyAction){
        this.simulating = true;
        const r = this.processAction(action, true);
        this.simulating = false;
        return r;
    }

    processQueue(){
        if (this.processing) return;
        this.processing = true;
        let next;
        while(next = this.actionQueue.next()){
            this.processAction(next);
        }
        this.processing = false;
    }
};

