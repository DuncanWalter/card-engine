
import { CardPool } from "./cardPool"

export const cardSets: Set<CardSet> = new Set()


export class CardSet {
    
    color: string
    name: string
    cardPool: CardPool<>
    description: string
    parings: Map<CardSet, string>

    constructor(name: string, color: string, cardPool: CardPool<>, description: string){
        this.name = name
        this.color = color
        this.description = description
        this.cardPool = cardPool
        this.parings = new Map()
    }

}