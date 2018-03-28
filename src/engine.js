import type { Card } from './cards/card'
import { Module } from './utils/module'
import { ActionResolver } from './actions/actionResolver'
import { StartCombat } from './actions/startCombat'
import { state as game } from './components/battle/battleState'
import { Turtle } from './creatures/turtle/turtle'
import { Cobra } from './creatures/cobra/cobra'
import { StartGame } from './actions/startGame'

import './cards/adventurer/adventurer'
import { setupCombat, SetupCombat } from './actions/setupCombat';

export const engine = new Module('engine', ({ global, next }) => {    
    // global.cardLibrary = new Library(),
    // global.reactionLibrary = new Library(),
    next();

    game.resolver.initialize()
    game.resolver.enqueueActions(new StartGame({}, {}, {}))

    game.resolver.enqueueActions(new SetupCombat({}, {}, [
        new Turtle(15),
        new Turtle(16),
    ]))

    game.resolver.enqueueActions(new StartCombat({}, {}, {}))

    // global.cardLibrary.initialize();
    // global.reactionLibrary.initialize();
}, [], []);

