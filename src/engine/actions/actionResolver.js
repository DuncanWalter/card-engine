import { LL } from './../../core/linkedList'
import { topologicalSort } from '../../core/topologicalSort'
import type { Action, ConsumerArgs } from './../actions/action'
import type { GameStateSlice } from '../gameState'

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

function any(self: any): any { return self }

function testListener(action: AnyAction, listener: AnyListener){
    
    let matched = false
    const h = listener.header

    if(h.actors){
        if(h.actors.indexOf(action.actor) >= 0){
            matched = true
        } else {
            return false
        }
    }

    if(h.subjects){
        if(h.subjects.indexOf(action.subject) >= 0){
            matched = true
        } else {
            return false
        }
    }
    
    if(h.tags){
        if(h.tags.reduce((a, t) => action.tags.indexOf(t) >= 0 && a, true)){
            matched = true
        } else {
            return false
        }
    }

    if(h.filter){
        if(h.filter(action)){
            matched = true
        } else {
            return false
        }
    }

    return matched
}

export class ActionResolver {

    gameStateSlice: GameStateSlice
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

    constructor(listeners: Listeners, gameStateSlice: GameStateSlice){
        this.processing = false
        this.simulating = false
        this.actionQueue = new LL()
        this.listeners = listeners
        this.initialized = false
        this.listenerOrder = new Map()
        this.gameStateSlice = gameStateSlice
    }

    enqueueActions(...actions: AnyAction[]){
        if (this.simulating) return
        actions.forEach(action => this.actionQueue.append(action))
        if (!this.processing) this.processQueue()
    }

    pushActions(...actions: AnyAction[]){
        if (this.simulating) return
        actions.reverse().forEach(action => this.actionQueue.push(action))
        if (!this.processing) this.processQueue()
    }

    processAction<A: Action<>>(action: A): A {
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
                return ret
            }
        })(this.listeners)

        activeListeners.append(any(action))

        if(!this.simulating){ console.log(action.id, activeListeners.toArray().length) }

        const executionQueue: AnyListener[] = activeListeners.toArray().sort((a, b) => {
            const ai = (this.listenerOrder.get(a.id)||{index:-1}).index
            const bi = (this.listenerOrder.get(b.id)||{index:-1}).index
            return ai - bi
        })

        let index = -1
        let active = true
        const continuing = () => {
            let a = ++index < executionQueue.length
            let b = !(this.simulating && action == executionQueue[index])
            return a && b && active
        }
        const cancel = () => { active = false }
        const next = () => {
            while(continuing()){
                executionQueue[index].consumer({ 
                    data: action.data,
                    next,
                    cancel,
                    resolver: any(this),
                    subject: action.subject,
                    actor: action.actor,
                    game: this.gameStateSlice,
                })
            }
        }
        next()
        if(!this.simulating){
            this.gameStateSlice.emit()
        }
        return action
    }

    simulate(use: (trap: ActionResolver) => void){
        this.simulating = true
        const r = use(this)
        this.simulating = false
        return r
    }

    processQueue(){
        if (this.processing) return
        this.processing = true
        let next
        while(next = this.actionQueue.next()){
            this.processAction(next)
        }
        this.processing = false
    }

    registerListenerType(id: Symbol, parents?: Symbol[], children?: Symbol[]){
        if(this.initialized){
            throw new Error(`Cannot register id ${id.toString()} with action resolver after the resolver is initialized.`)
        } else {
            this.listenerOrder.set(id, {
                parents: parents || [],
                children: children || [],
                index: -1,
                id: id,
                compare(e){
                    return 0
                },
            })
        }
    }

    initialize(){
        if(this.initialized){
            throw new Error('Action Resolver initialized twice. Action Resolvers may only be initialized once.')
        }
        const order = topologicalSort(
            [...this.listenerOrder.values()]
        )
        order.forEach((e, i) => {
            e.index = i
        })
        this.initialized = true
    }

}

export function joinListeners(...ls: Listeners[]){
    return ls
}