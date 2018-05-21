import type { CardState } from "./card";
import type { ID } from '../utils/entity'
import { Card } from "./card"
import { Sequence } from "../utils/random"
import { EntityGroup } from "../utils/entityGroup";

export class CardStack extends EntityGroup<Class<Card<>>> {

    constructor(cards: ID<CardState<>>[]){
        super(Card, cards)
    }

    shuffle(seed: Sequence<number>): void {
        let swap = (a, b) => {
            let temp = this.ids[a]
            this.ids[a] = this.ids[b]
            this.ids[b] = temp
        }
        let size = this.ids.length
        let floor = Math.floor
        this.ids.forEach((__, index) => 
            swap(index, floor(seed.next()*size))
        )
    }

    
    shuffleIn(card: Card<>, seed: Sequence<number>): void {
        this.ids.splice(Math.floor(this.ids.length * seed.next()), 0, card.id)
    }

}
