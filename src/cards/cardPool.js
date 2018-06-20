import type { Card } from './card'
import type { CardStack } from './cardStack'
import { Sequence } from '../utils/random'

export function pickKey(
  distro: { [string]: number },
  seed: Sequence<number>
): string {
  let keys = Object.keys(distro)
  let val = keys.reduce((acc, key) => acc + distro[key], 0) * seed.next()
  let sum = 0
  for (let key of keys) {
    sum += distro[key] || 0
    if (sum > val) {
      return key
    }
  }
  console.log('Should NEVER happen...')
  return keys[0]
}

export class CardPool {
  name: string
  cards: Map<string, (() => Card<>)[]>
  color: string
  pairings: { [key: string]: string }

  sample(
    count: number,
    distro: { [key: string]: number },
    seed: Sequence<number>
  ): (() => Card<>)[] {
    let result = new Set()
    while (result.size < count) {
      let stack = this.cards.get(pickKey(distro, seed))
      if (stack) {
        let card = sampleArray(stack, seed)
        if (card) {
          result.add(card)
        }
      }
    }
    return [...result]
  }

  add(catagory: string, card: () => Card<>) {
    let cardCategory = this.cards.get(catagory)
    if (cardCategory) {
      cardCategory.push(card)
    } else {
      throw new Error('Cannot register cards to unregistered catagories')
    }
  }

  members(): Iterable<() => Card<>> {
    let cards = this.cards
    return (function*() {
      for (let cardList of cards.values()) {
        yield* cardList
      }
    })()
  }

  constructor(name: string, color: string, ...catagories: string[]) {
    this.name = name
    this.color = color
    this.cards = new Map()
    catagories.forEach((catagory) => this.cards.set(catagory, []))
  }
}

function sampleArray<T>(array: T[], seed: Sequence<number>): T | void {
  return array[Math.floor(array.length * seed.next())]
}

// export class CardPool<Key=Class<Card<any>>, Child: CardPool<any, any>=CardPool<>> {

//     name: string

//     children: Map<Key, Child>
//     cards: Set<Class<Card<any>>>

//     constructor(name?: string, color?: string){
//         this.name = name || ''
//         this.color = color || ''
//         this.children = new Map()
//         this.cards = new Set()
//     }

//     includes(card: Card<any> | Class<Card<any>>): boolean {
//         if(card instanceof Card){
//             return this.includes(card.constructor)
//         } else {
//             if(this.cards.has(card)){
//                 return true
//             } else {
//                 let found = false
//                 this.children.forEach(child => {
//                     if (child) found = found || child.includes(card)
//                 })
//                 return found
//             }
//         }
//     }

//     sample(count: number, seed: Sequence, distribution?: Map<mixed, number>): Class<Card<any>>[] {
//         if ( !count ) return []
//         if ( this.cards.size ) {
//             let cards = new CardStack(...[...this.cards].map(CC => new CC()))
//             cards.shuffle(seed)
//             return cards.take(count).map(cc => cc.constructor)
//         }

//         let dd = distribution || new Map()
//         let scale: number
//         let stack: CardStack
//         let cards: Class<Card<any>>[]

//         // assemble a table of frequencies for just this tier
//         let frequencies: Map<Key, number> = new Map()
//         this.children.forEach((child, key) => {
//             frequencies.set(key, dd.has(key) ? dd.get(key) || 0 : 0)
//         })

//         // if it's empty, make a uniform distribution
//         let subTotal = sum(frequencies)
//         if(subTotal){
//             scale = Math.ceil(count / subTotal)
//         } else {
//             scale = Math.ceil(count / this.children.size)
//         }

//         cards = []
//         this.children.forEach((child, key) => {
//             cards.push(...child.sample(scale * (dd.get(key) || 1), seed, dd))
//         })

//         stack = new CardStack(...cards)
//         stack.shuffle(seed)
//         cards = stack.take(count)
//         if(cards.length < count){ console.log('failed to faithfully sample card pool') }
//         return cards
//     }

//     register(name: Key, child: Child){
//         this.children.set(name, child)
//     }

//     add(card: Class<Card<any>>){
//         this.cards.add(card)
//     }

// }

// function sum(numbers: Iterable<[any, number]>){
//     return [...numbers].reduce((a, b) => a + b[1], 0)
// }
