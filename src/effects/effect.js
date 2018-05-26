import type { ListenerGroup, ListenerType, Header, Consumer } from '../events/listener'
import type { Creature } from "../creatures/creature"
import type { Card } from "../cards/card"
import type { ListenerDefinition } from '../events/defineListener';
import { Listener, ConsumerArgs, EventContent, deafListener } from '../events/listener'
import { startTurn, endTurn, type Tag } from '../events/event'
import { BindEffect } from '../events/bindEffect'
import { resolver } from '../events/eventResolver'
import { Entity, createEntity } from '../utils/entity';
import { defineListener } from '../events/defineListener'

// TODO: put setters on stacks
// TODO: should be name, not type?
export interface EffectState {
    stacks: number,
    type: string,
}

interface StackBehavior {
    stacked: boolean,
    delta: (current: number) => number,
    min: number,
    max: number,
    on?: Tag,
}

interface Appearance {
    innerColor: string,
    outerColor: string,
    name: string,
    description: string,
    sides: number,
    rotation?: number,
}

export interface EffectDefinition {
    stackBehavior: StackBehavior,
    appearance: Appearance | void | null,
    listenerFactory: (owner: Card<> | Creature<>) => ListenerGroup,
    effectFactory: { type: ListenerType<any> } & (stacks: number) => Effect,
}

const definedEffects: Map<string, EffectDefinition> = new Map()

export const tick = resolver.registerListenerType('tick', [{ type: startTurn }, { type: endTurn }], [])


export class Effect extends Entity<EffectState> {

    get type(): string { 
        return this.inner.type 
    }

    get stacks(): number { 
        return this.inner.stacks 
    }

    get def(): EffectDefinition {
        const def = definedEffects.get(this.inner.type)
        if(def){
            return def
        } else {
            throw new Error(`Unrecognized Effect type ${this.type}`)
        }
    }

    // TODO: check for stack ranges
    set stacks(n: number){  
        this.inner.stacks = n 
    }

    get appearance(): Appearance | void | null {
        return this.def.appearance
    }

    asListener(owner: Card<>|Creature<>): ListenerGroup {
        const def = definedEffects.get(this.inner.type)
        let self = this
        if(def){
            return [
                new Listener(
                    tick,
                    {
                        subjects: [owner],
                        type: def.stackBehavior.on || startTurn,
                    },
                    function*({ subject, resolver }){
                        const change = def.stackBehavior.delta(self.stacks) - self.stacks
                        if(change){
                            resolver.pushEvents(new BindEffect(owner, owner, {
                                Effect: def.effectFactory,
                                stacks: change,
                            }, { type: tick }, def.effectFactory))
                        }
                    },
                    false,
                ),
                def.listenerFactory(owner),
            ]
        } else {
            throw new Error(`Unrecognized Effect type ${this.type}`)
        } 
    }

}


export function defineEffect<T:EventContent>(
    name: string,
    appearance: Appearance | void | null,
    stackBehavior: StackBehavior,
    header: (Creature<>|Card<>) => Header<T>,
    consumer: (Creature<>|Card<>, ListenerType<T>) => Consumer<T>,
    parents?: Tag[],
    children?: Tag[],
){
    const listener: ListenerDefinition<T, Creature<>|Card<> > = defineListener(name, header, consumer, parents, children)

    const factory = function(stacks: number){
        return new Effect(createEntity(Effect, {
            type: name,
            stacks,
        }))
    }

    factory.type = listener.type

    if(definedEffects.get(name)){
        throw Error('ID collision on ' + name)
    }

    definedEffects.set(name, {
        appearance,
        stackBehavior,
        effectFactory: factory,
        listenerFactory: function(owner){ return new listener(owner) },
    })

    return factory
}

export function defineCompoundEffect(
    type: string, 
    appearance: Appearance | void | null,
    stackBehavior: StackBehavior,
    ...listeners: ListenerDefinition<any, Creature<>|Card<> >[]
): (stacks: number) => Effect {

    const factory = function(stacks){
        return new Effect(createEntity(Effect, {
            type: type,
            stacks,
        }))
    }

    factory.type = deafListener.id

    if(definedEffects.get(type)){
        throw Error('ID collision on ' + type)
    }

    definedEffects.set(type, {
        appearance,
        stackBehavior,
        effectFactory: factory,
        listenerFactory: function(owner){ return listeners.map(LD => new LD(owner)) },
    })

    return factory

}


