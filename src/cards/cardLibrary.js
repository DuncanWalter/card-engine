import type { Rarity } from "./cardSet"
import { CardPool, pickKey } from "./cardPool"
import { CardSet } from "./cardSet"
import { Sequence } from "../utils/random"
import { Card } from "./card"
import { Player } from "../creatures/player"

type CardMembership = { rarity: Rarity, color: string }

const sets: Map<string, CardSet> = new Map()

export const CardLibrary = {
    register(set: CardSet){
        sets.set(set.name, set)
    },
    sample(count: number, setDistro: { [set: string]: number }, rarityDistro: { [rarity: Rarity]: number }, seed: Sequence<number>): (() => Card<>)[] {
        let result = new Set()
        while(result.size < count){
            let set = sets.get(pickKey(setDistro, seed))
            if(set){
                result.add(...set.sample(1, rarityDistro, seed))
            }
        }
        return [...result]
    },
    getCardMembership(fromSets: string[], card: Card<>): CardMembership {
        return fromSets.reduce((acc: CardMembership, name: string) => {
            let set = sets.get(name)
            if(set){
                return set.members.get(card.type) || acc
            } else {
                return acc
            }
        }, {
            color: '#353542',
            rarity: 'F',
        })  
    }
}