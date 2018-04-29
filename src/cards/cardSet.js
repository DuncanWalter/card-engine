
import { CardPool } from "./cardPool"
import { Sequence } from "../utils/random";
import { Card } from "./card";


export type Rarity = 'A' | 'B' | 'C' | 'D' | 'F'

export const cardSets: Set<CardSet> = new Set()

function any(any: any): any { return any }

export class CardSet {
    
    color: string
    name: string
    cardPool: CardPool
    members: Map<Class<Card<>>, { 
        rarity: Rarity,
        color: string,
    }>
    description: string
    // parings: Map<CardSet, string>

    add(rarity: Rarity, card: Class<Card<>>){
        this.cardPool.add(rarity, card)
        this.members.set(card, {
            rarity,
            color: this.color,
        })
    }

    sample(count: number, distro: { [rarity: Rarity]: number }, seed: Sequence): Class<Card<>>[] {
        return this.cardPool.sample(count, any(distro), seed)
    }

    constructor(name: string, color: string, description: string){
        this.members = new Map()
        this.name = name
        this.color = color
        this.description = description
        this.cardPool = new CardPool(name, color, 'A', 'B', 'C', 'D', 'F')
    }

}