import { State } from "../core/state";
import { ActionResolver } from "./actions/actionResolver";

export const gameState: * = new State(Symbol('base'), {}, {
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
    player: { health: 100, energy: 3 },
    allies: [],
    enemies: [{ health: 30 }],
});