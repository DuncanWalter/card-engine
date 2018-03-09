import type { Card } from './cards/card'
import { Module } from '../core/module'
import { Main } from '../chassis/components/main'
import { ActionResolver } from './actions/actionResolver'
import { Strike } from './cards/strike'
import { Defend } from './cards/defend'
import { Bash } from './cards/bash'
import { StartCombat } from './actions/startCombat'
import { gameSlice } from './gameState'
import { Turtle } from './creatures/turtle/turtle'
import { Player } from './creatures/player'
import { dispatch } from '../core/state'
import { Cobra } from './creatures/cobra/cobra';


export const engine = new Module('engine', ({ global, next }) => {    
    global.render = props => <Main/>;
    // global.cardLibrary = new Library(),
    // global.reactionLibrary = new Library(),
    next();
    dispatch('definePlayer', new Player(60))

    const game = gameSlice



    game.resolver.initialize()

    game.enemies.push(new Turtle(15))
    game.enemies.push(new Cobra(30))

    game.resolver.enqueueActions(new StartCombat({}, {}, {}))


    // global.cardLibrary.initialize();
    // global.reactionLibrary.initialize();
}, [], []);

