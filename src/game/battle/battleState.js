import type { PlayerState } from '../../creatures/player'
import type { State } from '../../state'
import type { Reducer } from '../../utils/state'
import type { MonsterState } from '../../creatures/monster'
import type { ID } from '../../utils/entity'
import type { PragmaState } from '../../pragmas/pragma'
import { randomSequence, Sequence } from '../../utils/random'
import { Card, CardState } from '../../cards/card'
import { CardStack } from '../../cards/cardStack'
import { createReducer } from '../../utils/state'
import { Monster } from '../../creatures/monster'
import { Player } from '../../creatures/player'
import { MonsterGroup } from '../../creatures/monsterGroup'
import { PragmaGroup } from '../../pragmas/pragmaGroup'
import { Path, PathState } from '../../paths/path'
import {
  toExtractor,
  toBundler,
  type EntityStore,
  toEntity,
} from '../../utils/entity'
import { EntityGroup } from '../../utils/entityGroup'
import { Entity } from '../../utils/entity'

// function any(any: any): any { return any }

// TODO:
// ancestor bonus for winning last game
// starter bonus for having reached level 15 (and actually dying without quitting)
// inspiration points

export interface Game {
  bossSeed: Sequence<number>;

  root: Path;
  path: Path;
  pragmaSequence: PragmaGroup;
  pragmaSeed: Sequence<number>;

  dummy: Monster;
  hand: CardStack;
  drawPile: CardStack;
  discardPile: CardStack;
  enemies: MonsterGroup;
  allies: MonsterGroup;
  player: Player;
  deck: CardStack;
  activeCards: CardStack;
  pragmas: PragmaGroup;

  exhaustPile: CardStack;
}

export interface GameState {
  entities: EntityStore;

  bossSeed: number;

  dummy: ID<MonsterState>;
  hand: ID<CardState<>>[];
  drawPile: ID<CardState<>>[];
  discardPile: ID<CardState<>>[];
  enemies: ID<MonsterState>[];
  allies: ID<MonsterState>[];
  player: ID<PlayerState>;
  deck: ID<CardState<>>[];
  exhaustPile: ID<CardState<>>[];
  activeCards: ID<CardState<>>[];

  pragmas: ID<PragmaState>[];
  pragmaSequence: ID<PragmaState>[];
  pragmaSeed: number;

  root: ID<PathState>;
  path: ID<PathState>;
}

function liftState(state: GameState): Game {
  const extract = toExtractor(state.entities)

  return {
    dummy: extract(Monster, state.dummy),
    hand: CardStack.from(extract, state.hand),
    enemies: MonsterGroup.from(extract, state.enemies),
    allies: MonsterGroup.from(extract, state.allies),
    player: extract(Player, state.player),
    activeCards: CardStack.from(extract, state.activeCards),
    exhaustPile: CardStack.from(extract, state.exhaustPile),
    discardPile: CardStack.from(extract, state.discardPile),
    drawPile: CardStack.from(extract, state.drawPile),
    deck: CardStack.from(extract, state.deck),

    pragmas: PragmaGroup.from(extract, state.pragmas),
    pragmaSequence: PragmaGroup.from(extract, state.pragmaSequence),
    pragmaSeed: randomSequence(state.pragmaSeed),

    path: extract(Path, state.path),
    root: extract(Path, state.root),

    bossSeed: randomSequence(state.bossSeed),
  }
}

function serializeGame(game: Game): GameState {
  const entities: EntityStore = {}
  const bundle = toBundler(entities)
  const bundleAll = function<T: Object>(eg: any): ID<T>[] {
    return [...eg].map((e) => bundle(e))
  }
  let state: GameState = {
    entities,

    bossSeed: game.bossSeed.last(),

    dummy: bundle(game.dummy),
    hand: bundleAll(game.hand),
    enemies: bundleAll(game.enemies),
    allies: bundleAll(game.allies),
    player: bundle(game.player),
    activeCards: bundleAll(game.activeCards),
    exhaustPile: bundleAll(game.exhaustPile),
    discardPile: bundleAll(game.discardPile),
    drawPile: bundleAll(game.drawPile),
    deck: bundleAll(game.deck),
    pragmas: bundleAll(game.pragmas),
    pragmaSequence: bundleAll(game.pragmaSequence),
    pragmaSeed: game.pragmaSeed.last(),
    path: bundle(game.path),
    root: bundle(game.root),
  }
  // console.log(JSON.parse(JSON.stringify(state)))
  return state
}

const game: Game = {
  entities: {},
  hand: new CardStack([]),
  drawPile: new CardStack([]),
  discardPile: new CardStack([]),
  deck: new CardStack([]),
  exhaustPile: new CardStack([]),
  player: toEntity(Player, {
    health: 65,
    maxHealth: 65,
    type: 'Player',
    effects: [],
    seed: 0,
    sets: [],
    energy: 3,
    isActive: true,
  }),
  allies: new MonsterGroup([]),
  enemies: new MonsterGroup([]),
  activeCards: new CardStack([]),
  dummy: toEntity(Monster, {
    health: 10,
    maxHealth: 10,
    type: 'TrainingDummy',
    effects: [],
    behavior: 'PRIME_BEHAVIOR',
    seed: 1234125151,
  }),
  pragmas: new PragmaGroup([]),
  pragmaSequence: new PragmaGroup([]),
  pragmaSeed: randomSequence(0),
  bossSeed: randomSequence(0),
  path: Path.generate(-1, ({}: any), randomSequence(0)),
  root: Path.generate(-1, ({}: any), randomSequence(0)),
}

export function saveGame() {}

export function loadGame() {}

export function withGame<T: { game: Game }, R>(
  fun: (T) => R
): (args: $Diff<T, { game: Game }>) => R {
  return function(args: $Diff<T, { game: Game }>) {
    return fun({ ...args, game })
  }
}
