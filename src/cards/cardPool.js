import { Card } from "./card"
import { CardStack } from "./cardStack"

export class CardPool<Key=Class<Card<any>>, Child: CardPool<any, any>=CardPool<>> {

    name: string
    color: string
    pairings: {
        [string]: string
    }
    children: Map<Key, Child>
    cards: Set<Class<Card<any>>>

    constructor(name?: string, color?: string){
        this.name = name || ''
        this.color = color || ''
        this.children = new Map()
        this.cards = new Set()
    }

    includes(card: Card<any> | Class<Card<any>>): boolean {
        if(card instanceof Card){
            return this.includes(card.constructor)
        } else {
            if(this.cards.has(card)){
                return true
            } else {
                let found = false
                this.children.forEach(child => {
                    if (child) found = found || child.includes(card)
                })
                return found
            }
        }
    }

    sample(count: number, distribution?: Map<mixed, number>): Class<Card<any>>[] {
        if ( !count ) return []
        if ( this.cards.size ) {
            let cards = new CardStack(...[...this.cards].map(CC => new CC()))
            cards.shuffle()
            return cards.take(count).map(cc => cc.constructor)
        }
        
        let dd = distribution || new Map()
        let scale: number
        let stack: CardStack
        let cards: Class<Card<any>>[]

        // assemble a table of frequencies for just this tier
        let frequencies: Map<Key, number> = new Map()
        this.children.forEach((child, key) => {
            frequencies.set(key, dd.has(key) ? dd.get(key) || 0 : 0)
        })

        // if it's empty, make a uniform distribution
        let subTotal = sum(frequencies)
        if(subTotal){
            scale = Math.ceil(count / subTotal)
        } else {
            scale = Math.ceil(count / this.children.size)
        }

        cards = []   
        this.children.forEach((child, key) => {
            cards.push(...child.sample(scale * (dd.get(key) || 1), dd))
        })

        stack = new CardStack(...cards)
        stack.shuffle()
        cards = stack.take(count)
        if(cards.length < count){ console.log('failed to faithfully sample card pool') }
        return cards
    }

    register(name: Key, child: Child){
        this.children.set(name, child)
    }

    add(card: Class<Card<any>>){
        this.cards.add(card)
    }

}


function sum(numbers: Iterable<[any, number]>){
    return [...numbers].reduce((a, b) => a + b[1], 0)
}