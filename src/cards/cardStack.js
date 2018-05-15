import { Card } from "./card"
import type { CardState } from "./card";
import { Sequence } from "../utils/random"

// $FlowFixMe
export class CardStack implements Iterable<Card<any>> {

    cards: CardState<any>[]

    constructor(cards: CardState<any>[]){
        this.cards = cards
    }

    get size(): number {
        return this.cards.length
    }

    unwrap(): CardState<>[] {
        return this.cards
    }

    shuffle(seed: Sequence<number>): void {
        let swap = (a, b) => {
            let temp = this.cards[a]
            this.cards[a] = this.cards[b]
            this.cards[b] = temp
        }
        let size = this.cards.length
        let floor = Math.floor
        this.cards.forEach((__, index) => 
            swap(index, floor(seed.next()*size))
        )
    }

    take(count?: number): Card<any>[] {
        let rr: Card<any>[] = []
        while(rr.length < (count || 1) && this.cards.length){
            rr.push(new Card(this.cards.pop()))
        }
        return rr
    }

    // takeAll(): Card<any>[] {
    //     let rr = this.cards
    //     this.cards = []
    //     return rr
    // }

    shuffleIn(card: Card<>, seed: Sequence<number>): void {
        this.cards.splice(Math.floor(this.cards.length * seed.next()), 0, card.unwrap())
    }

    addToTop(card: Card<any>): void {
        this.cards.push(card.unwrap())
    }

    addToBottom(card: Card<any>): void {
        this.cards.splice(0, 0, card.unwrap())
    }

    add(...cards: Card<any>[]){
        this.cards.push(...cards.map(card => card.unwrap()))
    }

    clone(): CardStack {
        return new CardStack([...this.cards.map(card => (new Card(card)).clone().unwrap())])
    }

    clear(): void {
        this.cards.splice(0, this.cards.length)
    }

    has(card: Card<any>): boolean {
        let id = card.unwrap().id
        return !!this.cards.filter(card => card.id == id).length
    }

    remove(card: Card<any>){
        let id = card.unwrap().id
        this.cards.filter(card => card.id == id).forEach(card => {
            this.cards.splice(this.cards.indexOf(card), 1)
        })
    }

    // $FlowFixMe
    [Symbol.iterator](){
        let self = this
        return (function*(): Generator<Card<any>, any, any> {
            yield* self.cards.map(card => new Card(card))
        })()
    } 
}
