import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import { Creature } from "./creature"
import { GameState } from "../game/battle/battleState"
import { Behavior } from "./behavior"
import { startCombat } from "../actions/action"
import { Listener } from "../actions/listener"
import { synchronize } from "../utils/async"
import { ActionResolver, resolver } from "../actions/actionResolver"
import { Sequence, randomSequence } from "../utils/random";


// TODO: figure out how to scale foe health better so they don't spawn with partial health


function any(any: any): any { return any }

export class NPC extends Creature {
    hasTakenTurn: boolean = true
    behavior: Behavior
    seed: {
        value: number, 
        generator: Sequence,
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
    resolver.registerListenerType(id, [startCombat])
    return class CustomCreature extends NPC {
        behavior: Behavior
        constructor(health){
            super(health, maxHealth)
            // TODO: get the randomness unified
            // TODO: where to seed from...
            let gen = randomSequence(23451453)            
            this.seed = {
                generator: gen,
                value: gen.next(),
            }
            this.behavior = behavior.next(this)
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