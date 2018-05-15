import type { PlayerState } from "../../creatures/player"
import type { State } from "../../state"
import type { Reducer } from "../../utils/state"
import type { MonsterState } from '../../creatures/monster';

import { randomSequence, Sequence } from '../../utils/random'

import { Card, CardState } from "../../cards/card"
import { CardStack } from "../../cards/cardStack"
import { createReducer } from "../../utils/state"
import { Monster } from '../../creatures/monster';
import { Player } from '../../creatures/player';


function any(any: any): any { return any }

// TODO:
// ancestor bonus for winning last game
// starter bonus for having reached level 15 (and actually dying without quitting)
// inspiration points

export interface Game {
    dummy: Monster,
    hand: CardStack,
    drawPile: CardStack,
    discardPile: CardStack,
    enemies: Monster[],
    allies: Monster[],
    player: Player,
    equipment: Array<any>,
    deck: CardStack,
    exhaustPile: CardStack,
    activeCards: CardStack,
    famePoints: number,    
}

interface GameState {
    dummy: MonsterState,
    hand: CardState<>[],
    drawPile: CardState<>[],
    discardPile: CardState<>[],
    enemies: MonsterState[],
    allies: MonsterState[],
    player: PlayerState,
    equipment: Array<any>,
    deck: CardState<>[],
    exhaustPile: CardState<>[],
    activeCards: CardState<>[],
    famePoints: number, 
}

export function liftState(state: GameState): Game {
    return {
        dummy: new Monster(state.dummy),
        hand: new CardStack(state.hand),
        enemies: state.enemies.map(enemy => new Monster(enemy)),
        allies: state.allies.map(ally => new Monster(ally)),
        player: new Player(state.player),
        equipment: state.equipment,
        activeCards: new CardStack(state.activeCards),
        exhaustPile: new CardStack(state.exhaustPile),
        discardPile: new CardStack(state.discardPile),
        drawPile: new CardStack(state.drawPile),
        deck: new CardStack(state.deck),
        famePoints: state.famePoints,
    }
}

function serializeGame(game: Game): GameState {

    let state = {
        dummy: game.dummy.unwrap(),
        hand: game.hand.unwrap(),
        enemies: game.enemies.map(enemy => enemy.unwrap()),
        allies: game.allies.map(ally => ally.unwrap()),
        player: game.player.unwrap(),
        equipment: game.equipment,
        activeCards: game.activeCards.unwrap(),
        exhaustPile: game.exhaustPile.unwrap(),
        discardPile: game.discardPile.unwrap(),
        drawPile: game.drawPile.unwrap(),
        deck: game.deck.unwrap(),
        famePoints: game.famePoints,
    }


    return state
}

export const battleInitial: GameState = {
    hand: [],
    drawPile: [],
    discardPile: [],
    deck: [],
    exhaustPile: [],
    equipment: [],
    player: {
        health: 65,
        maxHealth: 65,
        type: 'Player',
        effects: [],
        seed: 0,
        data: {
            sets: [],
            energy: 3,
            isActive: true,
        },
    },
    allies: [],
    enemies: [],
    activeCards: [],
    dummy: {
        health: 10,
        maxHealth: 10,
        type: 'TrainingDummy',
        effects: [],
        data: {
            behavior: {
                name: 'Blue',
                type: 'PRIME_BEHAVIOR',
            },
        },
        seed: 1234125151,
    },
    famePoints: 0,
}

export const battleReducer: Reducer<GameState, any, any> = createReducer({
    emitBattleState(slice: GameState, { game }: { game: Game }){
        return serializeGame(game)
    },
})

export function emit(game: Game){
    return {
        type: 'emitBattleState',
        game,
    }
}

// TODO: we need in file action dispatchers...
// export function bind(fn: (state: GameState) => GameState){
//     dispatcher.bind(fn)
// }

// export function emit(){
//     battleSlice.dispatcher.emit()
// }

// function clearBattleEffects(){
//     // TODO: make it happen
// }

// function save(){

// }

// function load(){

// }



