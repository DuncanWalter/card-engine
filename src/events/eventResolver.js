import type { Event, Tag } from './../events/event'
import type { ListenerGroup, ListenerType, Header } from './listener'
import type { State } from '../state'
import type { Game } from '../game/battle/battleState'
import { Listener, ConsumerArgs, reject, EventContent } from './listener'
import { LL } from '../utils/linkedList'
import { topologicalSort } from '../utils/topologicalSort'
import { synchronize } from '../utils/async'
import { Animation } from '../animations/animation'
import { Entity } from '../utils/entity';

function any(self: any): any { return self }

function testListener(event: Event<EventContent>, listener: Listener<any>): string {
    let matched = false
    const h: Header<EventContent> = listener.header
    if(h.type){
        if((h.type.type || h.type) === event.id){
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
        if(h.subjects.includes(event.subject)){
            matched = true
        } else {
            return 'Wrong Subject'
        }
    }
    if(h.tags){
        let tags = h.tags.map(tag => {
            if(typeof tag == 'string'){
                return tag
            } else {
                return tag.type
            }
        })
        if(tags.reduce((a, t) => event.tags.includes(t) && a, true)){
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

    initialized: boolean
    processing: boolean
    simulating: boolean
    eventQueue: LL<Event<any>>
    animations: Map<any, Set<Animation>>
    listenerOrder: Map<string, {
        parents: string[],
        children: string[],
        index: number,
        compare: any => 1 | 0 | -1,
        id: string,
    }>
    
    getGame: () => Game
    get game(): Game {
        return this.getGame()
    }

    constructor(){
        this.processing = false
        this.simulating = false
        this.eventQueue = new LL()
        this.initialized = false
        this.listenerOrder = new Map()
        this.animations = new Map()
    }

    processEvent<A: Event<any>>(event: A): Promise<A> {
        return processEvent(this, event)
    }
    
    processQueue(): Promise<void> {
        return processQueue(this)
    }

    enqueueEvents(...events: Event<any>[]): void {
        if (this.simulating) return
        events.forEach(event => this.eventQueue.append(event))
        if (!this.processing) this.processQueue()
    }

    pushEvents(...events: Event<any>[]): void {
        if (this.simulating) return
        events.reverse().forEach(event => this.eventQueue.push(event))
        if (!this.processing) this.processQueue()
    }

    simulate<R>(use: (trap: EventResolver, game: Game) => R): R {
        this.simulating = true
        const r: R = use(this, this.game)
        this.simulating = false
        return r
    }

    registerListenerType(type: string, parents?: Tag[], children?: Tag[]): ListenerType<any> {
        if(this.initialized){
            throw new Error(`Cannot register type ${type.toString()} with event resolver after the resolver is initialized.`)
        } else if(this.listenerOrder.get(type)){
            throw new Error(`Collision on name ${type}`)
        } else {
            this.listenerOrder.set(type, {
                // $FlowFixMe
                parents: parents? parents.map(p => typeof p == 'string' ? p : p.type): [],
                // $FlowFixMe
                children: children? children.map(c => typeof c == 'string' ? c : c.type): [],
                index: -1,
                id: type,
                compare(e){
                    return 0
                },
            })
            return any(type)
        }
    }

    // TODO: take a state context from hell
    initialize(getGame: () => Game){
        if(this.initialized){
            throw new Error('Event Resolver initialized twice. Event Resolvers may only be initialized once.')
        }
        const order = topologicalSort(
            [...this.listenerOrder.values()]
        )
        order.forEach((e, i) => {
            e.index = i
        })
        this.getGame = getGame
        this.initialized = true
    }
}

// TODO: this can be made cleaner. Also, if it returns the same list...
function applyInternals(ls: LL<Listener<any>>): LL<Listener<any>> {
    let listener, alv = ls.view(), listeners = ls
    while(listener = alv.list[0]){
        if(listener && listener.internal){
            const wrapper: Listener<any> = listener
            listeners = listeners.filter(listener => listener != wrapper).map((listener: Listener<any>) => {
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

function aggregate(ls: ListenerGroup, event: Event<any>, simulating: boolean): LL<Listener<any>> {
    // $FlowFixMe
    if(ls[Symbol.iterator]){
        // $FlowFixMe
        return [...ls].reduce((a: LL<Listener<any>>, ls: ListenerGroup) => {
            a.appendList(aggregate(ls, event, simulating))
            return a
        }, new LL())
    } else if(ls instanceof Listener){
        let test = testListener(event, ls)
        if(test == 'Passed'){
            return new LL(ls)
        } else {
            if(!simulating){
                // console.log(test, ls.id, ls.header)
            }
            return new LL()
        }
    } else {
        // $FlowFixMe
        return aggregate(ls.listener, event, simulating)
    } 
}

const processEvent = synchronize(function* processEvent(self: EventResolver, event: Event<any>): Generator<Promise<any>, Event<any>, any> {
    const game = self.game

    let activeListeners: LL<Listener<any>> = aggregate([
        game.player,
        game.enemies,
        game.allies,
        game.activeCards,
        game.drawPile,
        game.hand,
        game.discardPile,
        game.pragmas,
    ], event, self.simulating)
    
    activeListeners.append(event)
    event.defaultListeners.forEach((listener) => {
        activeListeners.append(listener)
    })

    if(!self.simulating){ console.log(event.id, event, game) }

    activeListeners = applyInternals(activeListeners)

    const executionQueue: Listener<any>[] = activeListeners.toArray().sort((a, b) => {
        // TODO: perform checks
        const ai = any(self.listenerOrder.get(any(a.id))).index
        const bi = any(self.listenerOrder.get(any(b.id))).index
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
    return event
})

const processQueue = synchronize(function* processQueue(self: EventResolver): Generator<any, void, any> {
    if (self.processing) return
    self.processing = true
    let next: Event<any>
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