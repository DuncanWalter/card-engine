import type { Action } from './../actions/action'
import type { GameStateSlice } from '../gameState'
import type { ListenerGroup } from './listener'
import { Listener, ConsumerArgs, reject } from './listener';
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
    }

    enqueueActions(...actions: Action<>[]){
        if (this.simulating) return
        actions.forEach(action => this.actionQueue.append(action))
        if (!this.processing) this.processQueue()
    }

    pushActions(...actions: Action<>[]){
        if (this.simulating) return
        actions.reverse().forEach(action => this.actionQueue.push(action))
        if (!this.processing) this.processQueue()
    }

    processAction<A: Action<>>(action: A): A {
        let activeListeners = aggregate(this.listeners, action)
        
        activeListeners.append(action)
        action.defaultListeners.forEach(listener => {
            activeListeners.append(listener)
        })

        if(!this.simulating){ console.log(action.id, action.data, activeListeners.toArray().length) }

        // This mess allows effects with defined internals to
        // wrap other listeners
        // TODO: popping will break if multiple wraps occur
        activeListeners = applyInternals(activeListeners)

        const executionQueue: Listener<>[] = activeListeners.toArray().sort((a, b) => {
            // TODO: perform checks
            // try{
                const ai = any(this.listenerOrder.get(a.id)).index
                const bi = any(this.listenerOrder.get(b.id)).index
                return ai - bi
            // } catch(e){
                
            //     console.log(a, b)
            //     return 0
            // }
        })

        let index = -1
        let active = true
        const continuing = () => {
            let a = ++index < executionQueue.length
            // TODO: action check can break w/ internals and sync converts...
            console.log(index, executionQueue[index])
            let b = a && !(this.simulating && executionQueue[index].header == reject)
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
                    internal: () => undefined,
                })
            }
        }
        next()
        if(!this.simulating){
            this.gameStateSlice.emit()
            // console.log(this.gameStateSlice.enemies[0])
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


// TODO: this can be made cleaner. Also, if it returns the same list...
function applyInternals(ls: LL<Listener<>>): LL<Listener<>> {
    let listener, alv = ls.view(), listeners = ls
    while(listener = alv.list[0]){
        if(listener && listener.internal){
            const wrapper = listener
            listeners = listeners.filter(listener => listener != wrapper).map(listener => {
                if(listener.id == wrapper.internal){
                    return Object.create(listener, {
                        consumer: {
                            value: args => {
                                args.internal = () => listener.consumer(args)
                                wrapper.consumer(args)
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