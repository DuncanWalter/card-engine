import type { ListenerGroup } from '../events/listener'
import type { Creature } from "../creatures/creature"
import type { Component } from "../component"
import type { Card } from "../cards/card"
import { Listener, ConsumerArgs } from '../events/listener'
import { startTurn, endTurn } from '../events/event'
import { BindEffect } from '../events/bindEffect'
import { resolver } from '../events/eventResolver'
import { Entity } from '../utils/entity';

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
    on?: Symbol,
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
        if(def){
            return [
                new Listener(
                    tick,
                    {
                        subjects: [owner],
                        tags: [def.stackBehavior.on || startTurn],
                    },
                    function*({ subject, resolver }){
                        const change = def.stackBehavior.delta(self.stacks) - self.stacks
                        if(change){
                            resolver.pushEvents(new BindEffect(owner, owner, {
                                Effect: def.effectFactory,
                                stacks: change,
                            }, tick))
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

export const tick = Symbol('tick')
resolver.registerListenerType(tick, [startTurn, endTurn], [])


export function defineEffect(
    id: Symbol, 
    appearance: Appearance | void | null,
    stackBehavior: StackBehavior,
    listener: (owner: Creature<> | Card<>, self: Effect) => Listener<>,
    parents: Symbol[],
    children: Symbol[],
): (stacks: number) => Effect {
    resolver.registerListenerType(id, parents, children)

    const factory = function(stacks){
        return new Effect({
            type: id.toString(),
            stacks,
        })
    }

    if(definedEffects.get(id.toString())){
        throw Error('id collsion on ' + id.toString())
    }

    definedEffects.set(id.toString(), {
        appearance,
        stackBehavior,
        effectFactory: factory,
        listenerFactory: listener,
    })

    return factory

}

















// // MetaClass for creating effect types
// export const defineEffect = function defineEffect(
//     id: Symbol,
//     appearance: Appearance | void | null,
//     stackBehavior: StackBehavior,
//     listener: (owner: Creature<> | Card<>, self: Effect) => Listener<>,
//     parents: Symbol[],
//     children: Symbol[],

// ): Class<Effect> {
//     // TODO: auto register these things and add deps to make it work
//     resolver.registerListenerType(id, parents, children)

//     function turnListener(cons: Class<Effect>, owner: { +effects: Effect[] }, self: Effect): Listener<> {
//         return new Listener(
//             tick,
//             {
//                 subjects: [owner],
//                 tags: [stackBehavior.on || startTurn],
//             },
//             function*({ subject, resolver }){
//                 const change = stackBehavior.delta(self.stacks) - self.stacks
//                 if(change){
//                     resolver.pushEvents(new BindEffect(owner, owner, {
//                         Effect: cons,
//                         stacks: change,
//                     }, id, tick))
//                 }
//             },
//             false,
//         )
//     } // TODO: add the semantics. as always. Should use id to be dependent of any custom listener
    
//     return class CustomEffect extends Effect {

//         id: Symbol = id
//         stacked: boolean = stackBehavior.stacked

//         constructor(owner: Creature<> | Card<any>, stacks: number){
//             super(owner, stacks)
//             this.listener = [ 
//                 turnListener(CustomEffect, owner, this), 
//                 listener(owner, this),
//             ]
//             this.stacks = stacks
//             this.owner = owner
//             this.appearance = appearance
//             this.stackBehavior = stackBehavior
//         } 
//     }
// }






