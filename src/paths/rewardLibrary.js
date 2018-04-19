import type { State } from "../state"
import { Sequence } from "../utils/random"
import { NPC } from "../creatures/npc"
import { synchronize } from "../utils/async";

export interface Reward {
    collected: boolean,
    cost: number,
    collect: (self: Reward, state: State) => Promise<void>,
    active: boolean,
    description: string,
}

const rewardLibrary: Reward[] = []

export function registerReward(description: string, cost: number, collect: (self: Reward, state: State) => any, init?: (reward: Reward, level: number, seed: Sequence) => Reward){
    rewardLibrary.push({
        collected: true,
        cost,
        collect: synchronize(collect),
        init: init || (i => i),
        active: false,
        description,
    })
}

export function getRewards(rewardFunds: number, level: number, seed: Sequence){
    let rewards = []
    let available = rewardLibrary
    let funds = rewardFunds
    while(funds > 0){
        available = available.filter(reward => reward.cost <= funds)
        console.log(funds, available)
        let candidates = available.filter(reward => reward.cost - funds < 1.5 + seed.next())
        console.log(candidates)
        let choice = candidates[Math.floor(seed.next() * candidates.length)]
        console.log(choice)
        funds -= choice.cost
        rewards.push(choice)
    }
    return rewards.map(reward => ({ 
        ...reward.init(reward, level, seed),
        collected: false, 
    }))
}