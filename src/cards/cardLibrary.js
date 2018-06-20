import type { Rarity, CharacterName } from '../character'
import { CardPool, pickKey } from './cardPool'
import { Character, F, Distro } from '../character'
import { Sequence } from '../utils/random'
import { Card } from './card'
import { Player } from '../creatures/player'

type CardMembership = { rarity: Rarity, color: string }

const sets: Map<CharacterName, Character> = new Map()

export const CardLibrary = {
  register(set: Character) {
    sets.set(set.name, set)
  },
  sample(
    count: number,
    setDistro: { [set: CharacterName]: number },
    rarityDistro: Distro,
    seed: Sequence<number>
  ): (() => Card<>)[] {
    let result = new Set()
    while (result.size < count) {
      // $FlowFixMe // TODO: Will be an annoying bug some day
      let set = sets.get(pickKey(setDistro, seed))
      if (set) {
        result.add(...set.sample(1, rarityDistro, seed))
      }
    }
    return [...result]
  },
  getCardMembership(fromSets: CharacterName[], card: Card<>): CardMembership {
    return fromSets.reduce(
      (acc: CardMembership, name: CharacterName) => {
        let set = sets.get(name)
        if (set) {
          return set.members.get(card.type) || acc
        } else {
          return acc
        }
      },
      {
        color: '#353542',
        rarity: F,
      }
    )
  },
}
