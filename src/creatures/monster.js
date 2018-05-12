import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import type { BehaviorType } from "./behavior"
import type { Game } from "../game/battle/battleState"
import { Creature, CreatureWrapper, creatureIds } from "./creature"
import { Behavior, BehaviorWrapper } from "./behavior"
import { startCombat } from "../actions/action"
import { Listener } from "../actions/listener"
import { synchronize, SyncPromise } from "../utils/async"
import { ActionResolver, resolver } from "../actions/actionResolver"
import { Sequence, randomSequence } from "../utils/random";
import { deepMixin } from "../utils/deepMixin"

interface MonsterData {
    behavior: Behavior<>,
    seed: number,
}

export type Monster = Creature<MonsterData>

export class MonsterWrapper extends CreatureWrapper {

    takeTurn(resolver: ActionResolver, game: $ReadOnly<Game>): Promise<void> {
        
        let self = this.inner
        
        // TODO: this kw is evil for types...
        return synchronize(function*(): * {
            yield self.data.behavior.perform({ owner: self, resolver, game })
            self.data.behavior = self.data.behavior.next(self)
        })()
    }

    constructor(representation: Monster){
        super(representation)
    }
}

const definedMonsters: Map<string, (last: BehaviorType, seed: Sequence<number>, owner: MonsterWrapper) => BehaviorType> = new Map()

export function defineMonster(
    name: string,
    health: number, 
    behavior: (last: BehaviorType, seed: Sequence<number>, owner: MonsterWrapper) => BehaviorType, 
    onCreate?: (self: MonsterWrapper, seed: Sequence<number>) => MonsterWrapper,
){

    if(!definedMonsters.get(name)){
        definedMonsters.set(name, behavior)
    } else {
        throw new Error(`MonsterType collision on ${name}.`)
    }

    return (seed: Sequence<number>) => {
        const base: Creature<> = { 
            id: creatureIds.next().value || '',
            type: name, 
            health,
            maxHealth: health,
            effects: [],
            data: {
                behavior: {
                    type: 'PRIME_BEHAVIOR',
                },
                seed: 0,
            },
        }
        return onCreate? onCreate(new MonsterWrapper(base), seed): new MonsterWrapper(base)
    }
}


// : Class<NPC> {
//     const id = Symbol(name)
//     resolver.registerListenerType(id, [startCombat])
//     return class CustomCreature extends NPC {
//         behavior: Behavior<>
//         constructor(health){
//             super(health, maxHealth)
//             // TODO: get the randomness unified
//             // TODO: where to seed from...
//             let gen = randomSequence(23451453)            
//             this.seed = {
//                 generator: gen,
//                 value: gen.next(),
//             }
//             this.behavior = behavior.next(this)
//             this.listener.push(new Listener(
//                 id,
//                 {
//                     type: startCombat,
//                 },
//                 onStartCombat(this),
//                 false,
//             ))
//         }
//     }
// }