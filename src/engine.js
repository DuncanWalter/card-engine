import type { Card } from './cards/card'
import { Module } from './utils/module'
import { Main } from './components/main'
import { ActionResolver } from './actions/actionResolver'
import { Strike } from './cards/strike'
import { Defend } from './cards/defend'
import { Bash } from './cards/bash'
import { StartCombat } from './actions/startCombat'
import { gameSlice } from './gameState'
import { Turtle } from './creatures/turtle/turtle'
import { Player } from './creatures/player'
import { Cobra } from './creatures/cobra/cobra';


export const engine = new Module('engine', ({ global, next }) => {    
    global.render = props => <Main/>;
    // global.cardLibrary = new Library(),
    // global.reactionLibrary = new Library(),
    next();

    const game = gameSlice.state

    gameSlice.dispatcher.definePlayer(new Player(60))

    game.resolver.initialize()

    game.enemies.push(new Turtle(15))
    game.enemies.push(new Cobra(30))

    game.resolver.enqueueActions(new StartCombat({}, {}, {}))


    // global.cardLibrary.initialize();
    // global.reactionLibrary.initialize();
}, [], []);

