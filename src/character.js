import { CardPool } from "./cards/cardPool"
import { Sequence } from "./utils/random"
import { Card } from "./cards/card"
import { Pragma } from "./pragmas/pragma";

export opaque type CharacterName = string
export opaque type Rarity = 'A' | 'B' | 'C' | 'D' | 'F'
export const A: Rarity = 'A'
export const B: Rarity = 'B'
export const C: Rarity = 'C'
export const D: Rarity = 'D'
export const F: Rarity = 'F'

export interface Distro {
    A?: number,
    B?: number,
    C?: number,
    D?: number,
    F?: number,
}

export const characters: Map<string, Character> = new Map()

function any(any: any): any { return any }

export class Character {
    
    +color: string
    +name: CharacterName
    +playable: boolean
    cardPool: CardPool
    pragmaPool: Map<Rarity, (() => Pragma)[]>
    members: Map<string, { 
        rarity: Rarity,
        color: string,
    }>
    +description: string

    addCard(rarity: Rarity, CC: () => Card<>){
        this.cardPool.add(rarity, CC)
        this.members.set(new CC().type, {
            rarity,
            color: this.color,
        })
    }

    addPragma(rarity: Rarity, factory: () => Pragma){
        const pragmas = this.pragmaPool.get(rarity)
        if(pragmas){
            pragmas.push(factory)
        } else {
            throw new Error()
        }
    }

    sample(count: number, distro: Distro, seed: Sequence<number>): (() => Card<>)[] {
        return this.cardPool.sample(count, any(distro), seed)
    }

    cards(): Iterable< () => Card<> > {
        return this.cardPool.members()
    }

    constructor(name: string, playable: boolean, color: string, description: string){
        this.members = new Map()
        this.name = name
        this.playable = playable
        this.color = color
        this.description = description
        this.cardPool = new CardPool(name, color, 'A', 'B', 'C', 'D', 'F')
        this.pragmaPool = new Map()
        this.pragmaPool.set(A, [])
        this.pragmaPool.set(B, [])
        this.pragmaPool.set(C, [])
        this.pragmaPool.set(D, [])
        this.pragmaPool.set(F, [])
        characters.set(name, this)
    }

}