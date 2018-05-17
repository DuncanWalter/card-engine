
import { CardPool } from "./cardPool"
import { Sequence } from "../utils/random";
import { Card } from "./card";


export type Rarity = 'A' | 'B' | 'C' | 'D' | 'F'

export const cardSets: Map<string, CardSet> = new Map()

function any(any: any): any { return any }

export class CardSet {
    
    color: string
    name: string
    playable: boolean
    cardPool: CardPool
    members: Map<string, { 
        rarity: Rarity,
        color: string,
    }>
    description: string

    add(rarity: Rarity, CC: () => Card<>){
        this.cardPool.add(rarity, CC)
        this.members.set(new CC().type, {
            rarity,
            color: this.color,
        })
    }

    sample(count: number, distro: { [rarity: Rarity]: number }, seed: Sequence<number>): (() => Card<>)[] {
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
        cardSets.set(name, this)
    }

}