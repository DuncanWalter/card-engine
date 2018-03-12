import type { NPC } from "./creatures/npc"
import type { Card } from "./cards/card"
import type { Player } from "./creatures/player"

import { Slice } from "./utils/state"
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

export const gameSlice = new Slice({
    definePlayer(state, player){
        state.player = player
        return state
    },
}, initialState)

initialState.resolver = new ActionResolver(any({
    get listener(){
        return [
            gameSlice.state.hand,
            gameSlice.state.drawPile,
            gameSlice.state.exhaustPile,
            gameSlice.state.equipment,
            gameSlice.state.enemies,
            gameSlice.state.player,
            gameSlice.state.allies,
            gameSlice.state.activeCards,
        ]
    },
}), gameSlice)





