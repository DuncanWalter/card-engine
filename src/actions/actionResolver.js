import type { Action } from './../actions/action'
import type { ListenerGroup } from './listener'
import type { Slice } from '../utils/state'
import type { State } from '../state'
import type { Game } from '../game/battle/battleState'
import { Listener, ConsumerArgs, reject } from './listener'
import { LL } from '../utils/linkedList'
import { topologicalSort } from '../utils/topologicalSort'
import { synchronize } from '../utils/async'
import { Animation } from '../animations/animation'

interface GameTransducer {
    +getGame: () => Game,
    +setGame: (game: Game) => void,
}

function any(self: any): any { return self }

function testListener(action: Action<>, listener: Listener<>){
    let matched = false
    const h = listener.header
    if(h.actors){
        if(h.actors.reduce((acc, actor) => acc || action.actors.has(actor), false)){
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

    state: GameTransducer
    initialized: boolean
    processing: boolean
    simulating: boolean
    actionQueue: LL<Action<>>
    animations: Map<any, Set<Animation>>
    listenerOrder: Map<Symbol, {
        parents: Symbol[],
        children: Symbol[],
        index: number,
        compare: any => 1 | 0 | -1,
        id: Symbol,
    }>

    constructor(){
        this.processing = false
        this.simulating = false
        this.actionQueue = new LL()
        this.initialized = false
        this.listenerOrder = new Map()
        this.animations = new Map()
    }

    processAction<A: Action<>>(action: A): Promise<A> {
        return processAction(this, action)
    }
    
    processQueue(): Promise<void> {
        return processQueue(this)
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

    // TODO: take a state context from hell
    initialize(game: GameTransducer){
        if(this.initialized){
            throw new Error('Action Resolver initialized twice. Action Resolvers may only be initialized once.')
        }
        const order = topologicalSort(
            [...this.listenerOrder.values()]
        )
        order.forEach((e, i) => {
            e.index = i
        })
        this.state = game
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
    if(!ls){
        return new LL() // TODO: maybe not a silent fail?
    } else
    // $FlowFixMe
    if(ls[Symbol.iterator]){
        // $FlowFixMe
        return [...ls].reduce((a: LL<Listener<>>, ls: ListenerGroup) => {
            a.appendList(aggregate(ls, action))
            return a
        }, new LL())
    } else if(ls instanceof Listener){
        let ret = testListener(action, ls) ? new LL(ls) : new LL()
        return ret
    } else {
        // $FlowFixMe
        return aggregate(ls.listener, action)
    } 
}



const processAction = synchronize(function* processAction(self: ActionResolver, action: Action<>): Generator<any, Action<>, any> {
    let game = self.state.getGame()    
    
    
    let activeListeners: LL<Listener<>> = aggregate([
        game.player,
        game.enemies,
        game.allies,
        game.activeCards,
        game.drawPile,
        game.hand,
        game.discardPile,
    ], action)
    
    activeListeners.append(action)
    action.defaultListeners.forEach((listener: *) => {
        activeListeners.append(listener)
    })

    if(!self.simulating){ 
        console.log(action.id, action.data, activeListeners.toArray().length, self.actionQueue.toArray()) 
    }

    activeListeners = applyInternals(activeListeners)

    const executionQueue: Listener<>[] = activeListeners.toArray().sort((a, b) => {
        // TODO: perform checks
        const ai = any(self.listenerOrder.get(a.id)).index
        const bi = any(self.listenerOrder.get(b.id)).index
        return ai - bi
    })

    let index: number = -1
    let active: boolean = true

    

    const continuing = (): boolean => {
        let a = ++index < executionQueue.length
        // TODO: action check can break w/ internals and sync converts...
        let b = a && !(self.simulating && executionQueue[index].header == reject)
        
        return active = a && b && active
    }
    const cancel: () => void = () => { active = false; console.log('cancelling') }
    const next: () => Promise<void> = synchronize(function*(): Generator<any, any, any> {
        while(continuing()){
            yield executionQueue[index].consumer({ 
                data: action.data,
                next,
                cancel,
                resolver: self,
                subject: action.subject,
                actors: action.actors,
                action,
                game,
                internal: () => { 
                    throw new Error('Internal listener envoked by non-wrapper listener') 
                },
            })
        }
    })
    yield next()
    if(!self.simulating){
        // TODO: figure out what to do here
        self.state.setGame(game)
    }
    return action
})

const processQueue = synchronize(function* processQueue(self: ActionResolver): Generator<any, void, any> {
    if (self.processing) return
    self.processing = true
    let next: Action<>
    // $FlowFixMe
    while(next = self.actionQueue.next()){
        yield self.processAction(next)
        if(!self.simulating){
            // yield new Promise(resolve => setTimeout(resolve, 300))
            // for(let aniSet of self.animations){
            //     for(let ani of aniSet){
            //         yield ani.unblocked
            //     }
            // }
        }
    }
    self.processing = false
})

export const resolver = new ActionResolver()