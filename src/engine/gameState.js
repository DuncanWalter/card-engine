import { createStore } from "../core/state";
import { ActionResolver } from "./actions/actionResolver";
import { Player } from "./creatures/player";
import { Creature } from "./creatures/creature";
import type { StateSlice } from '../core/state'

const initialState = {
    resolver: new ActionResolver([]),
    hand: [
        // new Strike(),
        // new Defend(),
        // new Strike(),
        // new Defend(),
        // new Strike(),
        // new Defend(),
    ],
    drawPile: [
        // new Strike(),
        // new Defend(),
        // new Strike(),
        // new Defend(),
        // new Strike(),
        // new Defend(),
    ],
    discardPile: [
        // new Strike(),
        // new Defend(),
        // new Strike(),
        // new Defend(),
        // new Strike(),
        // new Defend(),
    ],
    exhaustPile: [],
    equipment: [],
    player: new Player(60),
    allies: [],
    enemies: [new Creature(40)],
}

initialState.resolver = new ActionResolver([
    initialState.hand,
    initialState.drawPile,
    initialState.exhaustPile,
    initialState.equipment,
    initialState.enemies,
    initialState.player,
    initialState.allies,
])

console.log(initialState.player instanceof Creature);

export const { dispatch, createSlice, destroySlice } = createStore()

type GameState = StateSlice<typeof initialState, any> // TODO: rename to game?
export const gameState: GameState = createSlice(Symbol('base'), {
    endTurn(state: *){
        // TODO: can't do this here, must be in an action
        state.player.energy = 0;
        state.player.energy += 3;

        while(state.hand.length){
            state.discardPile.push(state.hand.pop());
        }

        while(state.discardPile.length){
            state.drawPile.splice(
                Math.floor(Math.random()*state.drawPile.length),
                0,
                state.discardPile.pop(),
            );
        }

        while(state.hand.length < 5){
            state.hand.push(state.drawPile.pop());
        }

        return state;
    },
}, initialState);