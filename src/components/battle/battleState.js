import type { NPC } from "../../creatures/npc"
import type { Card } from "../../cards/card"
import type { Player } from "../../creatures/player"

import { CardStack } from "../../cards/cardStack"
import { Slice } from "../../utils/state"
import { ActionResolver } from "../../actions/actionResolver"

function any(any: any): any { return any }

export interface GameState {
    resolver: ActionResolver,
    hand: CardStack,
    drawPile: CardStack,
    discardPile: CardStack,
    enemies: NPC[],
    allies: NPC[],
    player: Player,
    equipment: Array<any>,
    deck: CardStack,
    exhaustPile: CardStack,
    activeCards: CardStack
}

const initialState: GameState = {
    resolver: any(null),
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
}

export const { state, dispatcher, stream } = new Slice({
    emit(state){
        return { ... state }
    },
    bind(state, data){
        return { ...data(state) }
    },
}, initialState)

initialState.resolver = new ActionResolver(any({
    get listener(){
        return [
            state.hand,
            state.drawPile,
            state.exhaustPile,
            state.equipment,
            state.enemies,
            state.player || [], // TODO: just no. terrible idea.
            state.allies,
            state.activeCards,
        ]
    },
}), { state, emit })

export function bind(fn: (state: GameState) => GameState){
    dispatcher.bind(fn)
}

export function emit(){
    dispatcher.emit()
}



