import type { ListenerGroup, ConsumerArgs } from '../events/listener'
import type { BehaviorState } from './behavior'
import type { Game } from '../game/battle/battleState'
import { CreatureState, Creature } from './creature'
import { Behavior, primeBehavior } from './behavior'
import { startCombat } from '../events/event'
import { Listener } from '../events/listener'
import { synchronize, SyncPromise } from '../utils/async'
import { EventResolver, resolver } from '../events/eventResolver'
import { Sequence, randomSequence } from '../utils/random'
import { toExtractor } from '../utils/entity'

interface MonsterData {
  behavior: BehaviorState;
}

export type MonsterState = CreatureState & MonsterData

const definedMonsters: Map<
  string,
  (last: BehaviorState, seed: Sequence<number>, owner: Monster) => BehaviorState
> = new Map()

export class Monster extends Creature<MonsterData> {
  get behavior(): Behavior {
    return new Behavior(this.inner.behavior)
  }

  set behavior(behavior: Behavior) {
    this.inner.behavior = behavior.unwrap()
  }

  seed: Sequence<number>

  takeTurn(resolver: EventResolver, game: $ReadOnly<Game>): Promise<void> {
    console.log('taking turn')
    let self = this
    return synchronize(function*(): * {
      yield self.behavior.perform({ owner: self, resolver, game })
      const getBehavior = definedMonsters.get(self.type)
      if (getBehavior) {
        self.behavior = new Behavior(
          getBehavior(self.behavior.name, self.seed, self)
        )
      } else {
        throw new Error(`unrecognized creature type ${self.type}`)
      }
    })()
  }
}

export function defineMonster(
  name: string,
  health: number,
  behavior: (
    last: BehaviorState,
    seed: Sequence<number>,
    owner: Monster
  ) => BehaviorState,
  onCreate?: (self: Monster, seed: Sequence<number>) => Monster
) {
  if (!definedMonsters.get(name)) {
    definedMonsters.set(name, behavior)
  } else {
    throw new Error(`MonsterType collision on ${name}.`)
  }

  return function(game: $ReadOnly<Game>, seed: Sequence<number>) {
    const base: MonsterState = {
      type: name,
      health,
      maxHealth: health,
      effects: [],
      seed: seed.next(),
      behavior: primeBehavior,
    }
    const self = new Monster(base, toExtractor({}))
    if (onCreate) {
      onCreate(self, seed)
    }
    self.takeTurn(resolver, game)
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
