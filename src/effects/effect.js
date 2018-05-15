import type { ListenerGroup } from '../events/listener'
import type { Creature } from "../creatures/creature"
import type { Component } from "../component"
import type { Card } from "../cards/card"
import { Listener, ConsumerArgs } from '../events/listener'
import { startTurn } from '../events/turnActions'
import { BindEffect } from '../events/bindEffect'
import { resolver } from '../events/eventResolver'

// TODO: put setters on stacks

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

export class Effect {

    stackBehavior: StackBehavior
    stacks: number
    id: Symbol
    turnDelta: number
    listener: ListenerGroup
    owner: Creature<> | Card<>
    appearance: Appearance | void | null

    constructor(owner: Creature<> | Card<>, stacks: number){
        /*/ NO OP /*/
    }
}

export const tick = Symbol('tick')
resolver.registerListenerType(tick, [startTurn], [])

// MetaClass for creating effect types
export const MetaEffect = function MetaEffect(
    id: Symbol,
    appearance: Appearance | void | null,
    stackBehavior: StackBehavior,
    listener: (owner: Creature<> | Card<>, self: Effect) => Listener<>,
    parents: Symbol[],
    children: Symbol[],

): Class<Effect> {
    // TODO: auto register these things and add deps to make it work
    resolver.registerListenerType(id, parents, children)

    function turnListener(cons: Class<Effect>, owner: { +effects: Effect[] }, self: Effect): Listener<> {
        return new Listener(
            tick,
            {
                subjects: [owner],
                tags: [stackBehavior.on || startTurn],
            },
            function*({ subject, resolver }){
                const change = stackBehavior.delta(self.stacks) - self.stacks
                if(change){
                    resolver.pushEvents(new BindEffect(owner, owner, {
                        Effect: cons,
                        stacks: change,
                    }, id, tick))
                }
            },
            false,
        )
    } // TODO: add the semantics. as always. Should use id to be dependent of any custom listener
    
    return class CustomEffect extends Effect {

        id: Symbol = id
        stacked: boolean = stackBehavior.stacked

        constructor(owner: Creature<> | Card<any>, stacks: number){
            super(owner, stacks)
            this.listener = [ 
                turnListener(CustomEffect, owner, this), 
                listener(owner, this),
            ]
            this.stacks = stacks
            this.owner = owner
            this.appearance = appearance
            this.stackBehavior = stackBehavior
        } 
    }
}

