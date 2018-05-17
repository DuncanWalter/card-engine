import type { State } from "../state"
import { Sequence } from "../utils/random"
import { synchronize } from "../utils/async";

export interface Reward {
    collected: boolean,
    cost: number,
    collect: (self: Reward, state: State) => Promise<void>,
    active: boolean,
    description: string,
    id: Symbol,
    init: (reward: Reward, level: number, seed: Sequence<number>) => Reward,
}

const rewardLibrary: Reward[] = []
function any(any: any): any { return any }

export function registerReward(description: string, cost: number, collect: (self: Reward, state: State) => any, init?: (reward: Reward, level: number, seed: Sequence<number>) => Reward){
    rewardLibrary.push({
        collected: true,
        cost,
        collect: synchronize(collect),
        init: init || (i => i),
        active: false,
        description,
        id: any(null),
    })
}

export function getRewards(rewardFunds: number, level: number, seed: Sequence<number>){
    let rewards = []
    let available = rewardLibrary
    let funds = rewardFunds
    while(funds > 0){
        available = available.filter(reward => reward.cost <= funds)
        let candidates = available.filter(reward => reward.cost - funds < 1.5 + seed.next())
        let choice = candidates[Math.floor(seed.next() * candidates.length)]
        funds -= choice.cost
        rewards.push(choice)
    }
    return rewards.map(reward => ({ 
        ...reward.init(reward, level, seed),
        collected: false, 
        id: Symbol('id'),
    }))
}