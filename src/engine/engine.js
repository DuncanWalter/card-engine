import { Module } from '../core/module'
import { Main } from '../chassis/components/main'
import { ActionResolver } from './actions/actionResolver'
import { Strike } from './cards/strike'
import { Defend } from './cards/defend'
import { Bash } from './cards/bash'

import { gameState } from './gameState';

import type { Card } from './cards/card'



export const engine = new Module('engine', ({ global, next }) => {    
    global.render = props => <Main/>;
    // global.cardLibrary = new Library(),
    // global.reactionLibrary = new Library(),
    next();

    const game = gameState
    game.hand.push(new Strike())
    game.hand.push(new Strike())
    game.hand.push(new Bash())
    game.hand.push(new Defend())
    game.hand.push(new Defend())

    game.resolver.initialize()


    // global.cardLibrary.initialize();
    // global.reactionLibrary.initialize();
}, [], []);

