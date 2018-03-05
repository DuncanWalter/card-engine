import { createSlice } from "../core/state"
import { ActionResolver } from "./actions/actionResolver"
import { Player } from "./creatures/player"
import { Creature } from "./creatures/creature"
import type { NPC } from "./creatures/npc"
import type { Card } from "./cards/card"

import type { Listeners } from "./actions/actionResolver"
import type { StateSlice } from "../core/state"

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
    player: new Player(60),
    allies: [],
    enemies: [],
    activeCards: [],
}

export const gameSlice = createSlice('game', {}, initialState)

initialState.resolver = new ActionResolver(any([
    initialState.hand,
    initialState.drawPile,
    initialState.exhaustPile,
    initialState.equipment,
    initialState.enemies,
    initialState.player,
    initialState.allies,
    initialState.activeCards,
]), gameSlice)





