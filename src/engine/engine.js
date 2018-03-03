import { Module } from '../core/module'
import { Main } from '../chassis/components/main'
import { ActionResolver } from './actions/actionResolver'
import { Strike } from './cards/strike'
import { Defend } from './cards/defend'
import { Bash } from './cards/bash'
import { StartCombat } from './actions/startCombat'
import { gameSlice } from './gameState'

import { Turtle } from './creatures/turtle/turtle'
import type { Card } from './cards/card'



export const engine = new Module('engine', ({ global, next }) => {    
    global.render = props => <Main/>;
    // global.cardLibrary = new Library(),
    // global.reactionLibrary = new Library(),
    next();

    const game = gameSlice

    game.resolver.initialize()

    game.enemies[0] = new Turtle(15)

    game.resolver.enqueueActions(new StartCombat({}, {}, {}))


    // global.cardLibrary.initialize();
    // global.reactionLibrary.initialize();
}, [], []);

