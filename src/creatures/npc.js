import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import { Creature } from "./creature"
import { GameState, gameSlice } from "../gameState"
import { Behavior } from "./behavior"
import { startCombat } from "../actions/action"
import { Listener } from "../actions/listener"
import MersenneTwister from "mersenne-twister"
import { synchronize } from "../utils/async";
import { ActionResolver } from "../actions/actionResolver";

function any(any: any): any { return any }

export class NPC extends Creature {
    hasTakenTurn: boolean = true
    behavior: Behavior
    seed: {
        value: number, 
        generator: MersenneTwister,
    }
    takeTurn(resolver: ActionResolver, game: $ReadOnly<GameState>): Promise<void> {
        return synchronize(function*(): * {
            yield this.behavior.perform({ owner: this, resolver, game })
            this.behavior = this.behavior.next(this)
            this.hasTakenTurn = true
        }, this)()
    }
}

export function MetaCreature(
    name: string,
    maxHealth: number, 
    behavior: Behavior, 
    onStartCombat: (self: NPC) => (ctx: ConsumerArgs<any, NPC, NPC>) => void,
): Class<NPC> {

    const id = Symbol(name)

    gameSlice.state.resolver.registerListenerType(id, [], [startCombat])
    return class CustomCreature extends NPC {

        behavior: Behavior

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
            let gen = new MersenneTwister()
            this.seed = {
                generator: gen,
                value: gen.random(),
            }
        }
    }
}