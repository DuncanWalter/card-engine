import { LL } from './../../utility/linkedList'

type listener = {
    header: {
        tags?: Array<string>,
        subject?: Object,
        actor?: Object,
    },
    consume: ({
        actor: Object,
        subject: object,
        resolver: ActionResolver,
        next: () => void,
        cancel: () => void,
    }) => void,
};

type ActionResolver = {
    processing: boolean,
    simulating: boolean,
    actionQueue: Iterable<Action>,
    enqueueAction: (Action) => Action,
    pushAction: (Action) => Action,
    processAction: (Action, boolean) => Action,
};

type Factory = (Iterable<Listener>) => ActionResolver;
export const ActionResolver: Factory = listeners => ({
    processing: false,
    simulating: false,
    actionQueue: LL(),
    enqueueAction(action){
        if (this.simulating) return;
        this.actionQueue.append(action);
        if (!this.processing) this.processQueue();
    },
    pushAction(action){
        if (this.simulating) return;
        this.actionQueue.push(action);
        if (!this.processing) this.processQueue();
    },
    processAction(action, simulate){
        if (this.simulating && !simulate) return;
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
        console.log('action',  action);
        action.consumer({ 
            action,
            resolver: this,
            subject: action.subject,
            actor: action.actor,
        });
        return action;
    },
    simulateAction(action){
        simulating = true;
        this.processAction(action, true);
        simulating = false;
    },
    processQueue(){
        if (this.processing) return;
        this.processing = true;
        while(this.actionQueue.list[1]){
            this.processAction(this.actionQueue.pop());
        }
        this.processing = false;
    },
});

