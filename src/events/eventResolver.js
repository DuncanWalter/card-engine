import type { Event } from './../events/event'
import type { ListenerGroup } from './listener'
import type { State } from '../state'
import type { Game } from '../game/battle/battleState'
import { Listener, ConsumerArgs, reject, EventType } from './listener'
import { LL } from '../utils/linkedList'
import { topologicalSort } from '../utils/topologicalSort'
import { synchronize } from '../utils/async'
import { Animation } from '../animations/animation'
import { Entity } from '../utils/entity';

interface GameTransducer {
    +getGame: () => Game,
    +setGame: (game: Game) => void,
}

function any(self: any): any { return self }

function testListener(event: Event<EventType>, listener: Listener<>): string {
    let matched = false
    const h = listener.header
    if(h.type){
        if(h.type == event.id){
            matched = true
        } else {
            return 'Wrong Event Type'
        }
    }
    if(h.actors){
        const headerIds = [...h.actors].map(actor => actor.id)
        const actorIds = [...event.actors].map(actor => actor.id)
        if(headerIds.reduce((acc, actor) => acc || actorIds.includes(actor), false)){
            matched = true
        } else {
            return 'Wrong Actor'
        }
    }
    if(h.subjects){
        if(event.subject.indexIn(h.subjects) >= 0){
            matched = true
        } else {
            return 'Wrong Subject'
        }
    }
    if(h.tags){
        if(h.tags.reduce((a, t) => event.tags.includes(t) && a, true)){
            matched = true
        } else {
            return 'Wrong Tags'
        }
    }
    if(h.filter){
        if(h.filter(event)){
            matched = true
        } else {
            return 'Filtered Out'
        }
    }
    return matched? 'Passed': 'No Header'
}

export class EventResolver {

    state: GameTransducer
    initialized: boolean
    processing: boolean
    simulating: boolean
    eventQueue: LL<Event<>>
    animations: Map<any, Set<Animation>>
    listenerOrder: Map<string, {
        parents: string[],
        children: string[],
        index: number,
        compare: any => 1 | 0 | -1,
        id: string,
    }>

    constructor(){
        this.processing = false
        this.simulating = false
        this.eventQueue = new LL()
        this.initialized = false
        this.listenerOrder = new Map()
        this.animations = new Map()
    }

    processEvent<A: Event<>>(event: A): Promise<A> {
        return processEvent(this, event)
    }
    
    processQueue(): Promise<void> {
        return processQueue(this)
    }

    enqueueEvents(...events: Event<>[]): void {
        if (this.simulating) return
        events.forEach(event => this.eventQueue.append(event))
        if (!this.processing) this.processQueue()
    }

    pushEvents(...events: Event<>[]): void {
        if (this.simulating) return
        events.reverse().forEach(event => this.eventQueue.push(event))
        if (!this.processing) this.processQueue()
    }

    simulate<R>(use: (trap: EventResolver) => R): R {
        this.simulating = true
        const r: R = use(this)
        this.simulating = false
        return r
    }

    registerListenerType(id: string, parents?: string[], children?: string[]){
        if(this.initialized){
            throw new Error(`Cannot register id ${id.toString()} with event resolver after the resolver is initialized.`)
        } else if(this.listenerOrder.get(id)){
            throw new Error(`Collision on name ${id}`)
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
            throw new Error('Event Resolver initialized twice. Event Resolvers may only be initialized once.')
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

let c = []
function aggregate(ls: ListenerGroup, event: Event<>): LL<Listener<>> {
    // $FlowFixMe
    if(ls[Symbol.iterator]){
        // $FlowFixMe
        return [...ls].reduce((a: LL<Listener<>>, ls: ListenerGroup) => {
            a.appendList(aggregate(ls, event))
            return a
        }, new LL())
    } else if(ls instanceof Listener){
        c.push(ls)
        let test = testListener(event, ls)
        if(test == 'Passed'){
            return new LL(ls)
        } else {
            c.push(test)
            return new LL()
        }
    } else {
        // $FlowFixMe
        return aggregate(ls.listener, event)
    } 
}


const processEvent = synchronize(function* processEvent(self: EventResolver, event: Event<>): Generator<any, Event<>, any> {
    let game = self.state.getGame()    
    
    let activeListeners: LL<Listener<>> = aggregate([
        game.player,
        game.enemies,
        game.allies,
        game.activeCards,
        game.drawPile,
        game.hand,
        game.discardPile,
    ], event)
    
    activeListeners.append(event)
    event.defaultListeners.forEach((listener: *) => {
        activeListeners.append(listener)
    })

    if(!self.simulating){ 
        console.log(event.id, event, game)
        // console.log('active:', activeListeners.toArray().length, 'checked:', c) 
    }

    c = []

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
        // TODO: event check can break w/ internals and sync converts...
        let b = a && !(self.simulating && executionQueue[index].header == reject)
        
        return active = a && b && active
    }
    const cancel: () => void = () => { 
        active = false 
        if(!self.simulating){
            console.log('Cancelled event', event)
        }
    }
    const next: () => Promise<void> = synchronize(function*(): Generator<any, any, any> {
        while(continuing()){
            yield executionQueue[index].consumer({ 
                data: event.data,
                next,
                cancel,
                resolver: self,
                subject: event.subject,
                actors: event.actors,
                event,
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
    return event
})

const processQueue = synchronize(function* processQueue(self: EventResolver): Generator<any, void, any> {
    if (self.processing) return
    self.processing = true
    let next: Event<>
    // $FlowFixMe
    while(next = self.eventQueue.next()){
        yield self.processEvent(next)
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

export const resolver = new EventResolver()