import type { PlayerState } from "../../creatures/player"
import type { State } from "../../state"
import type { Reducer } from "../../utils/state"
import type { MonsterState } from '../../creatures/monster';
import type { ID } from '../../utils/entity'
import type { PragmaState } from '../../pragmas/pragma';

import { randomSequence, Sequence } from '../../utils/random'

import { Card, CardState } from "../../cards/card"
import { CardStack } from "../../cards/cardStack"
import { createReducer } from "../../utils/state"
import { Monster } from '../../creatures/monster';
import { Player } from '../../creatures/player';
import { MonsterGroup } from '../../creatures/monsterGroup';
import { createEntity } from '../../utils/entity';
import { PragmaGroup } from '../../pragmas/pragmaGroup';


// function any(any: any): any { return any }

// TODO:
// ancestor bonus for winning last game
// starter bonus for having reached level 15 (and actually dying without quitting)
// inspiration points

export interface Game {
    dummy: Monster,
    hand: CardStack,
    drawPile: CardStack,
    discardPile: CardStack,
    enemies: MonsterGroup,
    allies: MonsterGroup,
    player: Player,
    equipment: Array<any>,
    deck: CardStack,
    exhaustPile: CardStack,
    activeCards: CardStack,
    pragmas: PragmaGroup,
    pragmaSequence: PragmaGroup,
}

export interface GameState {
    dummy: ID<MonsterState>,
    hand: ID<CardState<>>[],
    drawPile: ID<CardState<>>[],
    discardPile: ID<CardState<>>[],
    enemies: ID<MonsterState>[],
    allies: ID<MonsterState>[],
    player: ID<PlayerState>,
    equipment: Array<any>,
    deck: ID<CardState<>>[],
    exhaustPile: ID<CardState<>>[],
    activeCards: ID<CardState<>>[],
    pragmas: ID<PragmaState>[],
    pragmaSequence: ID<PragmaState>[],
    pragmaSequenceSeed: number,
}

export function liftState(state: GameState): Game {
    return {
        dummy: new Monster(state.dummy),
        hand: new CardStack(state.hand),
        enemies: new MonsterGroup(state.enemies),
        allies: new MonsterGroup(state.allies),
        player: new Player(state.player),
        equipment: state.equipment,
        activeCards: new CardStack(state.activeCards),
        exhaustPile: new CardStack(state.exhaustPile),
        discardPile: new CardStack(state.discardPile),
        drawPile: new CardStack(state.drawPile),
        deck: new CardStack(state.deck),
        pragmas: new PragmaGroup(state.pragmas),
        pragmaSequence: new PragmaGroup(state.pragmaSequence, state.pragmaSequenceSeed),
    }
}

function serializeGame(game: Game): GameState {

    let state = {
        dummy: game.dummy.id,
        hand: game.hand.ids,
        enemies: game.enemies.ids,
        allies: game.allies.ids,
        player: game.player.id,
        equipment: game.equipment,
        activeCards: game.activeCards.ids,
        exhaustPile: game.exhaustPile.ids,
        discardPile: game.discardPile.ids,
        drawPile: game.drawPile.ids,
        deck: game.deck.ids,
        pragmas: game.pragmas.ids,
        pragmaSequence: game.pragmaSequence.ids,
        pragmaSequenceSeed: game.pragmaSequence.seed || 0,
    }

    console.log(JSON.parse(JSON.stringify(state)))

    return state
}

export const battleInitial: GameState = {
    hand: [],
    drawPile: [],
    discardPile: [],
    deck: [],
    exhaustPile: [],
    equipment: [],
    player: createEntity(Player, {
        health: 65,
        maxHealth: 65,
        type: 'Player',
        effects: [],
        seed: 0,
        sets: [],
        energy: 3,
        isActive: true,
    }),
    allies: [],
    enemies: [],
    activeCards: [],
    dummy: createEntity(Monster, {
        health: 10,
        maxHealth: 10,
        type: 'TrainingDummy',
        effects: [],
        behavior: 'PRIME_BEHAVIOR',
        seed: 1234125151,
    }),
    pragmas: [],
    pragmaSequence: [],
    pragmaSequenceSeed: 0,
}

export const battleReducer: Reducer<GameState, mixed> = createReducer({
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



