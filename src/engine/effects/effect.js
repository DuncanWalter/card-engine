import type { Listeners } from "../actions/actionResolver";
import { Listener } from "../actions/actionResolver";
import type { Creature } from "../creatures/creature"

export const effects: Map<Symbol, Class<Effect>> = new Map()

export class Effect {

    stacked: boolean
    stacks: number
    id: Symbol
    turnDelta: number
    listener: Listeners
    owner: Creature
    color: string

    constructor(owner: Creature, stacks: number){
        /*/ NO OP /*/
    }
}

// MetaClass for creating effect types
export function MetaEffect(
    id: Symbol,
    stacked: boolean,
    delta: number,
    listener: (owner: Creature, self: Effect) => Listener<>,
): Class<Effect> {
    
    const turnListener = self => [] // TODO: add the semantics. as always. Should use id to be dependent of any custom listener
    class CustomEffect extends Effect {

        id: Symbol = id
        stacked: boolean = stacked
        turnDelta: number = delta

        constructor(owner: Creature, stacks: number){
            super(owner, stacks)
            this.listener = [ turnListener(this), listener(owner, this) ]
            this.stacks = stacks
            this.owner = owner
            this.color = '#554433'
        } 
    }

    effects.set(id, CustomEffect)
    return CustomEffect
}
