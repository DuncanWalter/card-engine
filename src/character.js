import type { Card } from './cards/card'
import type { Pragma } from './pragmas/pragma'
import { CardPool } from './cards/cardPool'
import { Sequence } from './utils/random'

export opaque type CharacterName = string
export opaque type Rarity = 'A' | 'B' | 'C' | 'D' | 'F'
export const A: Rarity = 'A'
export const B: Rarity = 'B'
export const C: Rarity = 'C'
export const D: Rarity = 'D'
export const F: Rarity = 'F'

export type Upgrade = (upgraded: void | 'L' | 'R') => void | Card<any>

export interface Distro {
  A?: number;
  B?: number;
  C?: number;
  D?: number;
  F?: number;
}

export const characters: Map<CharacterName, Character> = new Map()

function any(any: any): any {
  return any
}

export class Character {
  +color: string
  +name: CharacterName
  +playable: boolean
  cardPool: CardPool
  pragmaPool: Set<() => Pragma>
  members: Map<
    string,
    {
      rarity: Rarity,
      color: string,
      upgrades: Upgrade[],
    }
  >
  +description: string

  addCard(rarity: Rarity, CC: () => Card<>, ...upgrades: Upgrade[]) {
    this.cardPool.add(rarity, CC)
    this.members.set(new CC().type, {
      rarity,
      color: this.color,
      upgrades,
    })
  }

  addPragma(factory: () => Pragma) {
    this.pragmaPool.add(factory)
  }

  sample(
    count: number,
    distro: Distro,
    seed: Sequence<number>
  ): (() => Card<>)[] {
    return this.cardPool.sample(count, any(distro), seed)
  }

  cards(): Iterable<() => Card<>> {
    return this.cardPool.members()
  }

  constructor(
    name: string,
    playable: boolean,
    color: string,
    description: string
  ) {
    this.members = new Map()
    this.name = name
    this.playable = playable
    this.color = color
    this.description = description
    this.cardPool = new CardPool(name, color, 'A', 'B', 'C', 'D', 'F')
    this.pragmaPool = new Set()
    characters.set(name, this)
  }
}
