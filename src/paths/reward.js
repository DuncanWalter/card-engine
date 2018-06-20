import type { State } from '../state'
import type { Game } from '../game/battle/battleState'
import { Sequence } from '../utils/random'
import { synchronize } from '../utils/async'
import { EventResolver, resolver } from '../events/eventResolver'

type Collect<D> = (
  self: Reward<D>,
  resolver: EventResolver,
  game: Game
) => Promise<void>
type Init<D> = (
  self: Reward<D>,
  game: Game,
  seed: Sequence<number>
) => Reward<D>
type CollectInternal<D> = (
  self: Reward<D>,
  resolver: EventResolver,
  game: Game
) => Generator<Promise<any>, void, any>

export type Reward<D: Object> = D & {
  collected: boolean,
  +description: string,
  +type: string,
}

type RewardDefinition<D> = {
  +type: string,
  +cost: number,
  +collect: Collect<D>,
  +init: Init<D>,
  +description: string,
}

export const rewardLibrary: Map<string, RewardDefinition<any>> = new Map()
function any(any: any): any {
  return any
}

// TODO: reflect generator crap. yay.
export function registerReward<D: Object>(
  type: string,
  description: string,
  cost: number,
  collect: CollectInternal<D>,
  init?: Init<D>
) {
  rewardLibrary.set(type, {
    type,
    cost,
    collect: synchronize(collect),
    init: init || ((i) => i),
    description,
  })
}

export function getRewards(
  rewardFunds: number,
  game: Game,
  seed: Sequence<number>
): Reward<any>[] {
  const rewards: Reward<any>[] = []
  let available = [...rewardLibrary.values()]
  let funds = rewardFunds
  while (funds > 0 && available.length) {
    available = available.filter((reward) => reward.cost <= funds)
    let candidates = available.filter(
      (reward) => reward.cost - funds < 1.5 + seed.next()
    )
    let choice = candidates[Math.floor(seed.next() * candidates.length)]
    if (choice) {
      available.splice(available.indexOf(choice), 1)
      funds -= choice.cost
      rewards.push(
        choice.init(
          {
            collected: false,
            description: choice.description,
            type: choice.type,
          },
          game,
          seed
        )
      )
    } else {
      break
    }
  }
  return rewards
}

export function collect(
  reward: Reward<any>,
  resolver: EventResolver,
  game: Game
): Promise<void> {
  const def = rewardLibrary.get(reward.type)
  if (def) {
    return def.collect(reward, resolver, game)
  } else {
    return new Promise((resolve) => undefined)
  }
}
