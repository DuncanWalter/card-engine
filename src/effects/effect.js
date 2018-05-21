import type { ListenerGroup } from '../events/listener'
import type { Creature } from "../creatures/creature"
import type { Card } from "../cards/card"
import { Listener, ConsumerArgs } from '../events/listener'
import { startTurn, endTurn } from '../events/event'
import { BindEffect } from '../events/bindEffect'
import { resolver } from '../events/eventResolver'
import { Entity, createEntity } from '../utils/entity';

// TODO: put setters on stacks

export interface EffectState {
    stacks: number,
    type: string,
}

interface StackBehavior {
    stacked: boolean,
    delta: (current: number) => number,
    min: number,
    max: number,
    on?: string,
}

interface Appearance {
    innerColor: string,
    outerColor: string,
    name: string,
    description: string,
    sides: number,
    rotation?: number,
}

interface EffectDefinition {
    stackBehavior: StackBehavior,
    appearance: Appearance | void | null,
    listenerFactory: (owner: Card<> | Creature<>, self: Effect) => Listener<>,
    effectFactory: (stacks: number) => Effect,
}

const definedEffects: Map<string, EffectDefinition> = new Map()

export class Effect extends Entity<EffectState> {

    get type(): string { 
        return this.inner.type 
    }

    get stacks(): number { 
        return this.inner.stacks 
    }

    // TODO: check for stack ranges
    set stacks(n: number){  
        this.inner.stacks = n 
    }

    get appearance(): Appearance | void | null {
        const def = definedEffects.get(this.inner.type)
        if(def){
            return def.appearance 
        } else {
            throw new Error(`Unrecognized Effect type ${this.type}`)
        }
    }

    asListener(owner: Entity<any>): ListenerGroup {
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
                            }, tick, def.effectFactory(1).type))
                        }
                    },
                    false,
                ),
                def.listenerFactory(owner, this)
            ]
        } else {
            throw new Error(`Unrecognized Effect type ${this.type}`)
        } 
    }

}

export const tick = 'tick'
resolver.registerListenerType(tick, [startTurn, endTurn], [])

export function defineEffect(
    id: string, 
    appearance: Appearance | void | null,
    stackBehavior: StackBehavior,
    listener: (owner: Creature<> | Card<>, self: Effect) => Listener<>,
    parents: string[],
    children: string[],
): (stacks: number) => Effect {
    resolver.registerListenerType(id, parents, children)

    const factory = function(stacks){
        return new Effect(createEntity(Effect, {
            type: id,
            stacks,
        }))
    }

    if(definedEffects.get(id)){
        throw Error('ID collision on ' + id)
    }

    definedEffects.set(id, {
        appearance,
        stackBehavior,
        effectFactory: factory,
        listenerFactory: listener,
    })

    return factory

}


