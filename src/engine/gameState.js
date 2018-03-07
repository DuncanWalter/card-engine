import type { NPC } from "./creatures/npc"
import type { Card } from "./cards/card"
import type { StateSlice } from "../core/state"
import type { Player } from "./creatures/player"

import { createSlice } from "../core/state"
import { ActionResolver } from "./actions/actionResolver"


function any(any: any): any { return any }

export interface GameState {
    resolver: ActionResolver,
    hand: Card<any>[],
    drawPile: Card<any>[],
    discardPile: Card<any>[],
    enemies: NPC[],
    allies: NPC[],
    player: Player,
    equipment: Array<any>,
    deck: Card<any>[],
    exhaustPile: Card<any>[],
    activeCards: Card<any>[]
}

export type GameStateSlice = StateSlice<GameState, any>

const initialState: GameState = {
    resolver: any(null),
    hand: [],
    drawPile: [],
    discardPile: [],
    deck: [],
    exhaustPile: [],
    equipment: [],
    player: any(null),
    allies: [],
    enemies: [],
    activeCards: [],
}

export const gameSlice = createSlice('game', {
    definePlayer(state, player){
        state.player = player
        return state
    },
}, initialState)

initialState.resolver = new ActionResolver(any({
    get listener(){
        return [
            gameSlice.hand,
            gameSlice.drawPile,
            gameSlice.exhaustPile,
            gameSlice.equipment,
            gameSlice.enemies,
            gameSlice.player,
            gameSlice.allies,
            gameSlice.activeCards,
        ]
    },
}), gameSlice)





