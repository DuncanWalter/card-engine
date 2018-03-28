import type { Card } from "./card";

// $FlowFixMe
export class CardStack implements Iterable<Card<any>> {

    cards: Card<any>[]

    constructor(...cards: Card<any>[]){
        this.cards = cards
    }

    get size(): number {
        return this.cards.length
    }

    shuffle(): void {
        let swap = (a, b) => {
            let temp = this.cards[a]
            this.cards[a] = this.cards[b]
            this.cards[b] = temp
        }
        let size = this.cards.length
        let floor = Math.floor
        let rand = Math.random
        this.cards.forEach((__, index) => swap(index, floor(rand()*size)))
    }

    take(count?: number): Card<any>[] {
        let rr: Card<any>[] = []
        while(rr.length < (count || 1) && this.cards.length){
            rr.push(this.cards.pop())
        }
        return rr
    }

    takeAll(): Card<any>[] {
        let rr = this.cards
        this.cards = []
        return rr
    }

    shuffleIn(...cards: Iterable<Card<any>>): void {
        this.cards.push(...cards)
        this.shuffle()
    }

    addToTop(card: Card<any>): void {
        this.cards.push(card)
    }

    addToBottom(card: Card<any>): void {
        this.cards.splice(0, 0, card)
    }

    add(...cards: Iterable<Card<any>>){
        this.cards.push(...cards)
    }

    clone(): CardStack {
        return new CardStack(...this.cards.map(cc => new cc.constructor()))
    }

    clear(): void {
        this.cards = []
    }

    has(card: Card<any>): boolean {
        return this.cards.includes(card)
    }

    remove(card: Card<any>){
        if(this.cards.includes(card)){
            this.cards.splice(this.cards.indexOf(card), 1)
        }
    }

    // $FlowFixMe
    [Symbol.iterator](){
        let self = this
        return (function*(): Generator<Card<any>, any, any> {
            yield* self.cards
        })()
    } 
}
