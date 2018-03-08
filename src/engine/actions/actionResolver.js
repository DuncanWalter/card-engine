import type { Action } from './../actions/action'
import type { GameStateSlice } from '../gameState'
import type { ListenerGroup } from './listener'
import { Listener, ConsumerArgs, reject } from './listener'
import { LL } from './../../core/linkedList'
import { topologicalSort } from '../../core/topologicalSort'
import { synchronize } from '../../core/async'

function any(self: any): any { return self }

function testListener(action: Action<>, listener: Listener<>){
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
    if(h.type){
        if(h.type == action.id){
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
    actionQueue: LL<Action<>>
    listeners: ListenerGroup
    processAction: (action: Action<>) => Promise<Action<>>
    processQueue: () => Promise<void>
    listenerOrder: Map<Symbol, {
        parents: Symbol[],
        children: Symbol[],
        index: number,
        compare: any => 1 | 0 | -1,
        id: Symbol,
    }>

    constructor(listeners: ListenerGroup, gameStateSlice: GameStateSlice){
        this.processing = false
        this.simulating = false
        this.actionQueue = new LL()
        this.listeners = listeners
        this.initialized = false
        this.listenerOrder = new Map()
        this.gameStateSlice = gameStateSlice
        this.processAction = synchronize(processAction, this)
        this.processQueue = synchronize(processQueue, this)  
    }

    enqueueActions(...actions: Action<>[]): void {
        if (this.simulating) return
        actions.forEach(action => this.actionQueue.append(action))
        if (!this.processing) this.processQueue()
    }

    pushActions(...actions: Action<>[]): void {
        if (this.simulating) return
        actions.reverse().forEach(action => this.actionQueue.push(action))
        if (!this.processing) this.processQueue()
    }

    simulate<R>(use: (trap: ActionResolver) => R): R {
        this.simulating = true
        const r: R = use(this)
        this.simulating = false
        return r
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


// TODO: this can be made cleaner. Also, if it returns the same list...
function applyInternals(ls: LL<Listener<>>): LL<Listener<>> {
    let listener, alv = ls.view(), listeners = ls
    while(listener = alv.list[0]){
        if(listener && listener.internal){
            const wrapper: Listener<> = listener
            listeners = listeners.filter(listener => listener != wrapper).map((listener: Listener<>) => {
                if(listener.id == wrapper.internal){
                    return Object.create(listener, {
                        consumer: {
                            value: args => {
                                args.internal = () => listener.consumer(args)
                                return wrapper.consumer(args)
                            }
                        }
                    })
                } else {
                    return listener
                }
            })
            alv.pop()
        } else {
            alv.next()
        }  
    }
    return listeners
}


function aggregate(ls: ListenerGroup, action: Action<>): LL<Listener<>> {
    // console.log(ls)
    if(Array.isArray(ls)){
        return ls.reduce((a: LL<Listener<>>, ls: ListenerGroup) => {
            a.appendList(aggregate(ls, action))
            return a
        }, new LL())
    } else if(ls instanceof Listener){
        let ret = testListener(action, ls) ? new LL(ls) : new LL()
        return ret
    } else {
        return aggregate(ls.listener, action)
    } 
}



function* processAction(action: Action<>): Generator<any, Action<>, any> {
    let activeListeners: LL<Listener<>> = aggregate(this.listeners, action)
    
    activeListeners.append(action)
    action.defaultListeners.forEach((listener: *) => {
        activeListeners.append(listener)
    })

    if(!this.simulating){ console.log(action.id, action.data, activeListeners.toArray().length) }

    activeListeners = applyInternals(activeListeners)

    const executionQueue: Listener<>[] = activeListeners.toArray().sort((a, b) => {
        // TODO: perform checks
        const ai = any(this.listenerOrder.get(a.id)).index
        const bi = any(this.listenerOrder.get(b.id)).index
        return ai - bi
    })

    let index: number = -1
    let active: boolean = true
    const that: ActionResolver = this
    const continuing = (): boolean => {
        let a = ++index < executionQueue.length
        // TODO: action check can break w/ internals and sync converts...
        // console.log(index, executionQueue[index])
        let b = a && !(this.simulating && executionQueue[index].header == reject)
        
        return active = a && b && active
    }
    const cancel: () => void = () => { active = false }
    const next: () => Promise<void> = synchronize(function*(): Generator<any, any, any> {
        while(continuing()){
            yield executionQueue[index].consumer({ 
                data: action.data,
                next,
                cancel,
                resolver: any(that),
                subject: action.subject,
                actor: action.actor,
                game: that.gameStateSlice,
                internal: () => { 
                    throw new Error('Internal listener envoked by non-wrapper listener') 
                },
            })
        }
    })
    yield next()
    if(!this.simulating){
        this.gameStateSlice.emit()
        // console.log(this.gameStateSlice.enemies[0])
    }
    return action
}

function* processQueue(): Generator<any, void, any> {
    if (this.processing) return
    this.processing = true
    let next: Action<>
    while(next = this.actionQueue.next()){
        yield this.processAction(next)
        if(!this.simulating){
            yield new Promise(resolve => setTimeout(resolve, 300))
        }
    }
    this.processing = false
}