import { State } from "../core/state";
import { ActionResolver } from "./actions/actionResolver";

const initialState = {
    actionResolver: new ActionResolver(),
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
    player: { health: 100, maxHealth: 120, energy: 3, block: 0, color: '#33aa66' },
    allies: [],
    enemies: [{ health: 50, maxHealth: 50, block: 0, color: '#aa3366' }],
};

export const gameState: * = new State(Symbol('base'), {
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