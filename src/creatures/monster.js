import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import type { BehaviorType } from "./behavior"
import type { Game } from "../game/battle/battleState"
import { CreatureState, Creature } from "./creature"
import { BehaviorState, Behavior, primeBehavior } from "./behavior"
import { startCombat } from "../actions/action"
import { Listener } from "../actions/listener"
import { synchronize, SyncPromise } from "../utils/async"
import { ActionResolver, resolver } from "../actions/actionResolver"
import { Sequence, randomSequence } from "../utils/random";

interface MonsterData {
    behavior: BehaviorState,
}

export type MonsterState = CreatureState<MonsterData>

const definedMonsters: Map<string, (last: BehaviorType, seed: Sequence<number>, owner: Monster) => BehaviorType> = new Map()


export class Monster extends Creature<MonsterData> {

    get behavior(): Behavior {
        return new Behavior(this.inner.data.behavior)
    }
    set behavior(behavior: Behavior){
        this.inner.data.behavior = behavior.unwrap()
    }

    seed: Sequence<number>

    takeTurn(resolver: ActionResolver, game: $ReadOnly<Game>): Promise<void> {
        
        let self = this
        
        return synchronize(function*(): * {
            yield self.behavior.perform({ owner: self, resolver, game })
            const getBehavior = definedMonsters.get(self.behavior.type)
            if(getBehavior){
                self.behavior = new Behavior({
                    type: getBehavior(self.behavior.type, self.seed, self),
                    name: 'CURRENTlY NAMELESS', // TODO:  
                    
                })
            }
        })()
    }

    constructor(state: MonsterState){
        super(state)
    }
    
}


export function defineMonster(
    name: string,
    health: number, 
    behavior: (last: BehaviorType, seed: Sequence<number>, owner: Monster) => BehaviorType, 
    onCreate?: (self: Monster, seed: Sequence<number>) => Monster,
){

    if(!definedMonsters.get(name)){
        definedMonsters.set(name, behavior)
    } else {
        throw new Error(`MonsterType collision on ${name}.`)
    }

    return function(seed: Sequence<number>){
        const base: CreatureState<> = { 
            type: name, 
            health,
            maxHealth: health,
            effects: [],
            seed: seed.next(),
            data: {
                behavior: {
                    type: primeBehavior,
                    name: 'NAN',
                },
            },
        }
        let self = onCreate? onCreate(new Monster(base), seed): new Monster(base)
        self.takeTurn(resolver, resolver.state.getGame())
        return self
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