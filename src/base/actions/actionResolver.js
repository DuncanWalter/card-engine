import { LL } from './../../utility/linkedList'
import { topologicalSort } from '../../utility/topologicalSort'
import { gameState } from '../gameState'
import type { Action, ConsumerArgs } from './../actions/action'

type AnyAction = Action<any, any, any>

export type Header<Data=any, Subject=any, Actor=any> = {
    actors?: Actor[],
    subjects?: Subject[],
    tags?: Symbol[],
    filter?: (action: AnyAction) => boolean,
}

export interface Listener<Data=any, Subject=any, Actor=any> {
    id: Symbol,
    header: Header<Data, Subject, Actor>,
    consumer(ConsumerArgs<Data, Subject, Actor>): void,
}

export type AnyListener = Listener<>
export type Listeners = AnyListener | Listeners[] | { listener: Listeners }

function testListener(action: AnyAction, listener: AnyListener){
    
    let matched = false;
    const h = listener.header;

    if(h.actors){
        if(h.actors.indexOf(action.actor) >= 0){
            console.log('match on an actor')
            matched = true;
        } else {
            return false;
        }
    }

    if(h.subjects){
        if(h.subjects.indexOf(action.subject) >= 0){
            matched = true;
        } else {
            return false;
        }
    }
    
    if(h.tags){
        let tags = h.tags;
        if(h.tags.reduce((a, t) => tags.indexOf(t) >= 0 && a, true)){
            console.log('mAtched on some tags')
            matched = true;
        } else {
            console.log('rejected tags')
            return false;
        }
    }

    if(h.filter){
        if(h.filter(action)){
            matched = true;
        } else {
            return false;
        }
    }

    console.log('got to rock bottom')
    return matched;
}




export class ActionResolver {

    initialized: boolean
    processing: boolean
    simulating: boolean
    actionQueue: LL<AnyAction>
    listeners: Listeners
    listenerOrder: Map<Symbol, {
        parents: Symbol[],
        children: Symbol[],
        index: number,
        compare: any => 1 | 0| -1,
        id: Symbol,
    }>

    constructor(listeners: Listeners){
        this.processing = false;
        this.simulating = false;
        this.actionQueue = new LL();
        this.listeners = listeners;
        this.initialized = false;
        this.listenerOrder = new Map();
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
        if (this.simulating && !simulate) return action
        if(!this.initialized) throw 'wtf cowboy' // TODO: remove when not needed

        console.log('AAA', action);

        // aggregate all needed listeners
        const activeListeners = (function aggregate(ls: Listeners): LL<AnyListener> {
            if(Array.isArray(ls)){
                return ls.reduce((a: LL<AnyListener>, ls: Listeners) => {
                    a.appendList(aggregate(ls))
                    return a
                }, new LL())
            } else if(ls.listener){
                return aggregate(ls.listener)
            } else {
                
                let ret = testListener(action, ls) ? new LL(ls) : new LL()
                console.log('ret', ret.toArray(), ls);
                return ret
            }
        })(this.listeners)

        // create a listener out of the action??
        // append that to the activeListener list?

        activeListeners.append(Object.create(action, {
            header: {
                value: {}
            }
        }))

        console.log('AL', activeListeners);

        const executionQueue: AnyListener[] = activeListeners.toArray().sort((a, b) => {
            const ai = (this.listenerOrder.get(a.id)||{index:-1}).index;
            const bi = (this.listenerOrder.get(b.id)||{index:-1}).index;
            return ai - bi;
        })

        console.log('EXQ', executionQueue)
        let index = -1
        let active = true
        const cancel = () => { active = false }
        const next = () => {
            while(++index < executionQueue.length && active){
                console.log('exq', executionQueue)
                executionQueue[index].consumer({ 
                    data: action.data,
                    next,
                    cancel,
                    resolver: this,
                    subject: action.subject,
                    actor: action.actor,
                })
            }
        }
        next()
        gameState.emit()
        return action
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

    registerListenerType(id: Symbol, parents?: Symbol[], children?: Symbol[]){
        if(this.initialized){
            throw new Error(`Cannot register id ${id.toString()} with action resolver after the resolver is initialized.`);
        } else {
            this.listenerOrder.set(id, {
                parents: parents || [],
                children: children || [],
                index: -1,
                id: id,
                compare(e){
                    return 0
                },
            });
        }
    }

    initialize(){
        if(this.initialized){
            throw new Error('Action Resolver initialized twice. Action Resolvers may only be initialized once.');
        }
        const order = topologicalSort(
            [...this.listenerOrder.values()]
        );
        order.forEach((e, i) => {
            e.index = i;
        });
        this.initialized = true;
    }

};

export function joinListeners(...ls: Listeners[]){
    return ls;
}