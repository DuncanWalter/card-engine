import type { State } from '../state'
import type { Reducer } from '../utils/state'
import type { MonsterState } from '../creatures/monster'
import type { ID } from '../utils/entity'
import type { Game } from '../game/battle/battleState'
import { Sequence, randomSequence } from '../utils/random'
import { createReducer } from '../utils/state'
import { getEncounter } from './encounterLibrary'
import { getRewards, type Reward } from './reward'
import { Entity, toExtractor, toBundler } from '../utils/entity'
import { Monster } from '../creatures/monster'
import React from 'react'

export interface PathState {
  level: number;
  enemies: ID<MonsterState>[];
  challengeRating: number;
  rewards: Reward<any>[];
  seed: number;
  children: PathState[] | void;
}

export interface PathInner {
  level: number;
  enemies: Monster[];
  challengeRating: number;
  rewards: Reward<any>[];
  seed: Sequence<number>;
  children: Path[] | void;
}

export class Path extends Entity<PathState, PathInner> {
  get level(): number {
    return this.inner.level
  }

  get challengeRating(): number {
    return this.inner.challengeRating
  }

  get children(): Path[] | void {
    return this.inner.children
  }

  get rewards(): Reward<any>[] {
    return this.inner.rewards
  }

  get enemies(): Monster[] {
    return this.inner.enemies
  }

  get seed(): Sequence<number> {
    return this.inner.seed
  }

  static generate(level: number, game: Game, seed: Sequence<number>) {
    const Path = this
    const { enemies, challengeRating } = getEncounter(level, game, seed)

    const store = {}
    const bundle = toBundler(store)
    const extract = toExtractor(store)

    return new Path(
      {
        level,
        rewards: getRewards(challengeRating - level - 5, game, seed),
        enemies: enemies.map((enemy) => bundle(enemy)),
        challengeRating,
        seed: seed.last(),
        children: undefined,
      },
      extract
    )
  }

  unwrap(inner: PathInner, bundle: *): PathState {
    return {
      level: inner.level,
      challengeRating: inner.challengeRating,
      enemies: inner.enemies.map((enemy) => bundle(enemy)),
      children: inner.children
        ? inner.children.map((child) => bundle(child))
        : undefined,
      seed: inner.seed.last(),
      rewards: inner.rewards,
    }
  }

  wrap(state: PathState, extract: *): PathInner {
    return {
      level: state.level,
      challengeRating: state.challengeRating,
      enemies: state.enemies.map((enemy) => extract(Monster, enemy)),
      children: state.children
        ? state.children.map((child) => extract(Path, child))
        : undefined,
      seed: randomSequence(state.seed),
      rewards: state.rewards,
    }
  }

  generateChildren(game: Game): void {
    this.inner.children = [
      Path.generate(this.level + 1, game, this.seed),
      Path.generate(this.level + 1, game, this.seed),
      Path.generate(this.level + 1, game, this.seed),
    ]
  }
}

// export const pathReducer: Reducer<PathState, State> = createReducer({
//     generateFreedoms(slice){

//         let level = slice.level + 1
//         let isBossLevel = level % 12 == 0
//         let freedoms

//         if(isBossLevel && false){
//             // encounter = getBossEncounter(level, slice.random)
//             freedoms = []
//         } else {
//             freedoms = [
//                 createPath(level, slice.seed),
//                 createPath(level, slice.seed),
//                 createPath(level, slice.seed),
//             ]
//         }
//         return { ...slice, freedoms }
//     },
//     selectFreedom(slice, action, state){
//         return action.freedom
//     },
//     startPath(slice, action){
//         return createPath(0, randomSequence(action.seed))
//     },
//     activateReward: reducer(({ reward }) =>
//         ['rewards', rs => rs.map(r => ({ ...r, active: r.id == reward.id }))]
//     ),
//     collectReward: reducer(({ reward }) =>
//         ['rewards', rs => rs.map(r => ({ ...r, collected: r.collected || r.id == reward.id }))]
//     ),
//     deactivateReward: reducer(({ reward }) =>
//         ['rewards', rs => rs.map(r => ({ ...r, active: false }))]
//     ),
// })

// export function generateFreedoms(dispatch: (any) => void){
//     dispatch({ type: 'generateFreedoms' })
// }

// export function selectFreedom(dispatch: (any) => void, freedom: PathState){
//     dispatch({ type: 'selectFreedom', freedom })
// }

// export function startPath(dispatch: (any) => void, seed: number){
//     dispatch({ type: 'startPath', seed })
// }

// export function activateReward(dispatch: (any) => void, reward: Reward<any>){
//     dispatch({ type: 'activateReward', reward })
// }

// export function deactivateReward(dispatch: (any) => void, reward: Reward<any>){
//     dispatch({ type: 'deactivateReward', reward })
// }

// export function collectReward(dispatch: (any) => void, reward: Reward<any>){
//     dispatch({ type: 'collectReward', reward })
// }
