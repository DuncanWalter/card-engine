import type { NPC } from "../../creatures/npc"
import type { Card } from "../../cards/card"
import type { Player } from "../../creatures/player"

import { CardStack } from "../../cards/cardStack"
import { Slice } from "../../utils/state"

function any(any: any): any { return any }

export interface GameState {
    hand: CardStack,
    drawPile: CardStack,
    discardPile: CardStack,
    enemies: NPC[],
    allies: NPC[],
    player: Player,
    equipment: Array<any>,
    deck: CardStack,
    exhaustPile: CardStack,
    activeCards: CardStack,
    
    // room: number,
    
}

const initialState: GameState = {
    resolver: any(null),
    hand: new CardStack(),
    drawPile: new CardStack(),
    discardPile: new CardStack(),
    deck: new CardStack(),
    exhaustPile: new CardStack(),
    equipment: [],
    player: any([]), // TODO: mildly dirty
    allies: [],
    enemies: [],
    activeCards: new CardStack(),
}

export const { state, dispatcher, stream } = new Slice({
    emit(state){
        return { ... state }
    },
    bind(state, data){
        return { ...data(state) }
    },
}, initialState)

export function bind(fn: (state: GameState) => GameState){
    dispatcher.bind(fn)
}

export function emit(){
    dispatcher.emit()
}

export function clearBattleEffects(){
    // TODO: make it happen
}




