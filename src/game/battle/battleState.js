import type { NPC } from "../../creatures/npc"
import type { Card } from "../../cards/card"
import type { Player } from "../../creatures/player"
import type { State } from "../../state"
import type { Reducer } from "../../utils/state"
import { randomSequence, Sequence } from '../../utils/random'

import { CardStack } from "../../cards/cardStack"
import { createReducer } from "../../utils/state"


function any(any: any): any { return any }

// TODO:
// ancestor bonus for winning last game
// starter bonus for having reached level 15 (and actually dying without quitting)
// inspiration points

export interface GameState {

    dummy: NPC,

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

export const battleInitial: GameState = {
    hand: new CardStack(),
    drawPile: new CardStack(),
    discardPile: new CardStack(),
    deck: new CardStack(),
    exhaustPile: new CardStack(),
    equipment: [],
    player: any(null), 
    allies: [],
    enemies: [],
    activeCards: new CardStack(),
    random: randomSequence(Math.random() * 21452352),
    dummy: any(null),
}

export const battleReducer: Reducer<GameState, any, any> = createReducer({
    emitBattleState(state: GameState){
        return { ...state }
    },
})


// TODO: we need in file action dispatchers...
// export function bind(fn: (state: GameState) => GameState){
//     dispatcher.bind(fn)
// }

// export function emit(){
//     battleSlice.dispatcher.emit()
// }

function clearBattleEffects(){
    // TODO: make it happen
}

function save(){

}

function load(){

}



