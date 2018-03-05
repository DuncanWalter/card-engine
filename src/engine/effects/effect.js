import { Listener } from "../actions/actionResolver"
import { gameSlice } from "../gameState"
import { startTurn } from "../actions/turnActions"
import { ConsumerArgs } from "../actions/action"
import { BindEffect } from "../actions/bindEffect"

import type { Creature } from "../creatures/creature"
import { Card } from "../cards/card";
import type { Listeners } from "../actions/actionResolver"


export class Effect {

    stacked: boolean
    stacks: number
    id: Symbol
    turnDelta: number
    listener: Listeners
    owner: Creature | Card<any>
    color: string

    constructor(owner: Creature | Card<any>, stacks: number){
        /*/ NO OP /*/
    }
}

export const tick = Symbol('tick')
gameSlice.resolver.registerListenerType(tick, [startTurn], [])

// MetaClass for creating effect types
export const MetaEffect = function MetaEffect(
    id: Symbol,
    stacked: boolean,
    delta: number => number,
    listener: (owner: Creature | Card<any>, self: Effect) => Listener<>,
    parents: Symbol[],
    children: Symbol[],
): Class<Effect> {
    // TODO: auto register these things and add deps to make it work
    gameSlice.resolver.registerListenerType(id, parents, children)

    function turnListener(cons, owner, self){
        return {
            id: tick,
            header: {
                subjects: [owner],
                tags: [startTurn],
            },
            consumer({ subject, resolver }: ConsumerArgs<>){
                const change = delta(self.stacks) - self.stacks
                if(change){
                    resolver.pushActions(new BindEffect(owner, owner, {
                        Effect: cons,
                        stacks: change,
                    }, id, tick))
                }
            },
        }
    } // TODO: add the semantics. as always. Should use id to be dependent of any custom listener
    
    return class CustomEffect extends Effect {

        id: Symbol = id
        stacked: boolean = stacked

        constructor(owner: Creature | Card<any>, stacks: number){
            super(owner, stacks)
            this.listener = [ 
                turnListener(CustomEffect, owner, this), 
                listener(owner, this),
            ]
            this.stacks = stacks
            this.owner = owner
            this.color = '#554433'
        } 
    }
}
