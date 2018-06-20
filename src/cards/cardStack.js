import type { CardState } from './card'
import type { ID } from '../utils/entity'
import { Card } from './card'
import { Sequence } from '../utils/random'
import { EntityGroup } from '../utils/entityGroup'

export class CardStack extends EntityGroup<Card<>> {
  static Subset = Card

  shuffle(seed: Sequence<number>): void {
    let swap = (a, b) => {
      let temp = this.entities[a]
      this.entities[a] = this.entities[b]
      this.entities[b] = temp
    }
    let size = this.entities.length
    let floor = Math.floor
    this.entities.forEach((__, index) => swap(index, floor(seed.next() * size)))
  }

  shuffleIn(card: Card<>, seed: Sequence<number>): void {
    this.entities.splice(
      Math.floor(this.entities.length * seed.next()),
      0,
      card
    )
  }
}
