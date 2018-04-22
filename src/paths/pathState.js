import type { State } from '../state'
import type { Reducer } from '../utils/state'
import { NPC } from "../creatures/npc"
import { Sequence, randomSequence } from "../utils/random"
import { createReducer } from "../utils/state"
import { getEncounter } from "./encounterLibrary"
import { getRewards, Reward } from "./rewardLibrary"
import { reducer } from "vitrarius"

function createPath(level: number, seed: Sequence){

    let { enemies, challengeRating } = getEncounter(level, seed)

    let rewardFund = challengeRating - level - 5

    return {
        enemies,
        rewards: getRewards(rewardFund, level, seed),
        challengeRating,
        level,
        freedoms: [],
        seed: seed.fork(),
    }
}

interface PathState {
    level: number,
    enemies: NPC[],
    challengeRating: number, 
    rewards: any[],
    seed: Sequence,
    freedoms: PathState[],
}

export const pathReducer: Reducer<PathState, any, State> = createReducer({
    generateFreedoms(slice){

        let level = slice.level + 1
        let isBossLevel = level % 12 == 0
        let freedoms

        if(isBossLevel && false){
            // encounter = getBossEncounter(level, slice.random)
            freedoms = []
        } else {
            freedoms = [
                createPath(level, slice.seed), 
                createPath(level, slice.seed), 
                createPath(level, slice.seed),
            ]
        }
        return { ...slice, freedoms }
    },
    selectFreedom(slice, action, state){
        return action.freedom
    },
    startPath(slice, action){
        return createPath(0, randomSequence(action.seed))
    },
    activateReward: reducer(({ reward }) => 
        console.log('activating') || ['rewards', rs => console.log(rs) || rs.map(r => ({ ...r, active: r.id == reward.id }))]
    ),
    collectReward: reducer(({ reward }) => 
        ['rewards', rs => rs.map(r => ({ ...r, collected: r.collected || r.id == reward.id }))]
    ),
    deactivateReward: reducer(({ reward }) => 
        ['rewards', rs => rs.map(r => ({ ...r, active: false }))]
    ),
})

export const pathInitial: PathState = {
    level: 0,
    enemies: [],
    challengeRating: 0, 
    rewards: [],
    seed: randomSequence(1000567),
    freedoms: [],
}


export function generateFreedoms(dispatch: (any) => void){
    dispatch({ type: 'generateFreedoms' })
}

export function selectFreedom(dispatch: (any) => void, freedom: PathState){
    dispatch({ type: 'selectFreedom', freedom })
}

export function startPath(dispatch: (any) => void, seed: number){
    dispatch({ type: 'startPath', seed })
}

export function activateReward(dispatch: (any) => void, reward: Reward){
    dispatch({ type: 'activateReward', reward })
}

export function deactivateReward(dispatch: (any) => void, reward: Reward){
    dispatch({ type: 'deactivateReward', reward })
}

export function collectReward(dispatch: (any) => void, reward: Reward){
    dispatch({ type: 'collectReward', reward })
}