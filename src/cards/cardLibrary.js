import type { Rarity } from "./cardSet";
import { CardPool, pickKey } from "./cardPool"
import { CardSet } from "./cardSet";
import { Sequence } from "../utils/random";
import { Card } from "./card";
import { Player } from "../creatures/player";

// export type Grade = 1 | 2 | 3 | 4 | 5

// export const F: Grade = 1 // Strike, Defend
// export const D: Grade = 2 // Dodge, Quick Strike
// export const C: Grade = 3 // Blind, Trip
// export const B: Grade = 4 // FOS
// export const A: Grade = 5 // Apo, Enlightenment

const sets: Map<string, CardSet> = new Map()

export const CardLibrary = {

    register(set: CardSet){
        sets.set(set.name, set)
    },

    sample(count: number, setDistro: { [set: string]: number }, rarityDistro: { [rarity: Rarity]: number }, seed: Sequence): Class<Card<>>[] {
        let result = new Set()
        while(result.size < count){
            let set = sets.get(pickKey(setDistro, seed))
            if(set){
                result.add(...set.sample(1, rarityDistro, seed))
            }
        }
        return [...result]
    },


    getCardMembership(player: Player, card: Card<>): { 
        color: string,
        rarity: Rarity, 
    } | void {
        return player.sets.reduce((acc, name) => {
            let set = sets.get(name)
            if(set){
                return set.members.get(card.constructor) || acc
            } else {
                return acc
            }
        }, undefined)
    }


}
