import { Module } from './../core/module'
import type { Global } from './../core/module'

import { Main } from './components/main'

import { ActionResolver } from './actions/actionResolver'

import { Strike } from './cards/strike'
import { Defend } from './cards/defend'

export const base = new Module('base', ({ global, next }) => {
    
    global.render = props => <Main/>;

    global.actionResolver = ActionResolver();
    global.hand = [
        Strike(),
        Defend(),
        Strike(),
        Defend(),
        Strike(),
        Defend(),
    ];
    global.drawPile = [];
    global.discardPile = [];
    global.exhaustPile = [];
    global.equipment = [];
    global.energy = { max: 3, current: 3 },

    global.player = { health: 100 },
    global.enemy = { health: 30 },
    // global.cardLibrary = new Library(),
    // global.reactionLibrary = new Library(),

    next();

    // global.cardLibrary.initialize();
    // global.reactionLibrary.initialize();

}, [], []);