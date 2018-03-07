import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import { Creature } from "./creature"
import { GameState, gameSlice } from "../gameState"
import { Behavior } from "./behavior"
import { startCombat } from "../actions/action"
import { Listener } from "../actions/listener"

function any(any: any): any { return any }

export class NPC extends Creature {

    hasTakenTurn: boolean = true

    seed: number
    behavior: Behavior<>
    
    createTurnActions(game: $ReadOnly<GameState>){

        // deduce a move and target
        this.hasTakenTurn = true

        return this.behavior.actions(game, this)
        
    }

}

export function MetaCreature(
    name: string,
    maxHealth: number, 
    behavior: Behavior<>, 
    onStartCombat: (self: NPC) => (ctx: ConsumerArgs<any, NPC, NPC>) => void,
): Class<NPC> {

    const id = Symbol(name)

    gameSlice.resolver.registerListenerType(id)
    return class CustomCreature extends NPC {

        behavior: Behavior<>

        constructor(health){
            super(health, maxHealth)
            this.behavior = behavior
            this.listener.push(new Listener(
                id,
                {
                    type: startCombat,
                },
                onStartCombat(this),
                false,
            ))
        }
    }
}