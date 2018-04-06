import { Module } from './utils/module'
import { resolver } from './actions/actionResolver'
import { battleSlice } from './game/battle/battleState'
import { StartGame } from './actions/startGame'

import './cards/adventurer/adventurer'

let battle = battleSlice.state

export const engine = new Module('engine', ({ global, next }) => {    
    // global.cardLibrary = new Library(),
    // global.reactionLibrary = new Library(),
    next()

    // $FlowFixMe
    resolver.initialize(() => [
        battle.allies,
        battle.player,
        battle.enemies,
        battle.drawPile,
        battle.discardPile,
        battle.hand,
        battle.activeCards,
    ], { state: battle, emit: battleSlice.stream.emit })
    
    // global.cardLibrary.initialize();
    // global.reactionLibrary.initialize();
}, [], []);

