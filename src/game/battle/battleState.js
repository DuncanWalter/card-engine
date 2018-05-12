import type { Card } from "../../cards/card"
import type { Player } from "../../creatures/player"
import type { State } from "../../state"
import type { Reducer } from "../../utils/state"
import type { Monster } from '../../creatures/monster';

import { randomSequence, Sequence } from '../../utils/random'

import { CardStack } from "../../cards/cardStack"
import { createReducer } from "../../utils/state"
import { MonsterWrapper } from '../../creatures/monster';
import { PlayerWrapper } from '../../creatures/player';


function any(any: any): any { return any }

// TODO:
// ancestor bonus for winning last game
// starter bonus for having reached level 15 (and actually dying without quitting)
// inspiration points

export interface Game {
    dummy: MonsterWrapper,
    hand: CardStack,
    drawPile: CardStack,
    discardPile: CardStack,
    enemies: MonsterWrapper[],
    allies: MonsterWrapper[],
    player: PlayerWrapper,
    equipment: Array<any>,
    deck: CardStack,
    exhaustPile: CardStack,
    activeCards: CardStack,
    famePoints: number,    
}

interface GameState {
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

export function liftState(state: GameState): Game {
    return {
        dummy: new MonsterWrapper(state.dummy),
        hand: state.hand,
        enemies: state.enemies.map(enemy => new MonsterWrapper(enemy)),
        allies: state.enemies.map(ally => new MonsterWrapper(ally)),
        player: new PlayerWrapper(state.player),
        equipment: state.equipment,
        activeCards: state.activeCards,
        exhaustPile: state.exhaustPile,
        discardPile: state.discardPile,
        drawPile: state.drawPile,
        deck: state.deck,
        famePoints: state.famePoints,
    }
}

function serializeGame(game: Game): GameState {
    return {
        dummy: game.dummy.unWrap(),
        hand: game.hand,
        enemies: game.enemies.map(enemy => enemy.unWrap()),
        allies: game.enemies.map(ally => ally.unWrap()),
        player: game.player.unWrap(),
        equipment: game.equipment,
        activeCards: game.activeCards,
        exhaustPile: game.exhaustPile,
        discardPile: game.discardPile,
        drawPile: game.drawPile,
        deck: game.deck,
        famePoints: game.famePoints,
    }
}

export const battleInitial: GameState = {
    hand: new CardStack(),
    drawPile: new CardStack(),
    discardPile: new CardStack(),
    deck: new CardStack(),
    exhaustPile: new CardStack(),
    equipment: [],
    player: {
        health: 65,
        maxHealth: 65,
        effects: [],
        data: {
            sets: [],
            energy: 3,
        },
    }, 
    allies: [],
    enemies: [],
    activeCards: new CardStack(),
    dummy: {
    
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



