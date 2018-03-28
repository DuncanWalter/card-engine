import type { NPC } from "./npc"
import type { GameState } from "../components/battle/battleState"
import { Action } from "../actions/action"
import { ActionResolver } from "../actions/actionResolver"
import { synchronize } from "../utils/async"

export interface BehaviorData {
    damage?: number,
    isDefending?: boolean,
    isDebuffing?: boolean,
    isMajorDebuffing?: boolean,
    isBuffing?: boolean,
    isMiscBehavior?: boolean,
}

export interface BehaviorContext { 
    owner: NPC, 
    resolver: ActionResolver, 
    game: $ReadOnly<GameState> 
}

export class Behavior {

    name: string

    selectNext: (seed: number) => Behavior

    perform: (ctx: BehaviorContext) => Promise<BehaviorData>

    simulate(owner: NPC, resolver: ActionResolver, game: $ReadOnly<GameState>): BehaviorData {
        let data: BehaviorData = { isMiscBehavior: true }
        resolver.simulate(resolver => {
            this.perform({ owner, resolver, game }).then(val => data = val)
        })
        return data
    }

    next(owner: NPC): Behavior {
        const next = this.selectNext(owner.seed.value)
        owner.seed.value = owner.seed.generator.random()
        return next
    }

    constructor(
        name: string,
        selectNext: (seed: number) => Behavior,
        perform: ({ owner: NPC, resolver: ActionResolver, game: $ReadOnly<GameState> }) => BehaviorData | Generator<any, BehaviorData, any>,
    ){
        this.name = name
        this.selectNext = selectNext 
        this.perform = synchronize(perform, this)
    }

}
