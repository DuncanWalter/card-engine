import type { Rarity } from "./cardSet";
import { CardPool, pickKey } from "./cardPool"
import { CardSet } from "./cardSet";
import { Sequence } from "../utils/random";
import { Card } from "./card";
import { Player } from "../creatures/player";

type maybeCardMembership = { rarity: Rarity, color: string }

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


    getCardMembership(player?: Player, card: Card<>): { 
        color: string,
        rarity: Rarity, 
    } | void {

        if(!player){
            return [...sets.values()].reduce((acc, set) => {
                return set.members.get(card.constructor) || acc
            }, undefined)
        } else {
            return player.sets.reduce((acc, name: string) => {
                let set = sets.get(name)
                if(set){
                    return set.members.get(card.constructor) || acc
                } else {
                    return acc
                }
            }, undefined)
        }

        
    }


}