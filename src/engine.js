import { Module } from './utils/module'
import { resolver } from './actions/actionResolver'
import { state, emit } from './game/battle/battleState'
import { StartGame } from './actions/startGame'

import './cards/adventurer/adventurer'

export const engine = new Module('engine', ({ global, next }) => {    
    // global.cardLibrary = new Library(),
    // global.reactionLibrary = new Library(),
    next()

    // $FlowFixMe
    resolver.initialize(() => [
        state.allies,
        state.player || [], // TODO: badness of the highest order
        state.enemies,
        state.drawPile,
        state.discardPile,
        state.hand,
        state.activeCards,
    ], { state, emit })
    
    // global.cardLibrary.initialize();
    // global.reactionLibrary.initialize();
}, [], []);

