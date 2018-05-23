import type { Event } from "./event"
import { defineEvent } from "./event"
import { Player } from "../creatures/player"
import { CardLibrary } from "../cards/cardLibrary"
import { ConsumerArgs } from "./listener"
import { TrainingDummy } from "../creatures/trainingDummy"
import { dispatch } from "../state"
import { startPath, generateFreedoms } from "../paths/pathState"
import { Sequence, randomSequence } from "../utils/random"
import { Strike } from "../cards/adventurer/strike";
import { Defend } from "../cards/adventurer/defend";
import { Monster } from "../creatures/monster";
import { Card } from "../cards/card";
import { createEntity } from "../utils/entity";

export const startGame: string = 'startGame'
export const StartGame = defineEvent(startGame, function*({ resolver, game, data }){
    
    let seed = randomSequence(data.seed * Math.random())

    game.dummy = new TrainingDummy(randomSequence(1))
    game.player = new Player(createEntity(Player, {
        type: 'Player',
        health: 65,
        maxHealth: 65,
        effects: [],
        seed: data.seed,
        energy: 3,
        isActive: true,
        sets: [...data.character],
    }))
    game.deck.clear()
    game.drawPile.clear()
    game.hand.clear()
    game.discardPile.clear()
    game.exhaustPile.clear()
    game.enemies.clear()
    game.allies.clear()
    game.equipment = []
    

    let cards = CardLibrary.sample(5, data.character.reduce((acc, set) => {
        acc[set] = 0.6
        return acc
    }, { Adventurer: 1.5 }), {
        F: 0.9,
        D: 0.5,
        C: 0.3,
        B: 0.1,
    }, seed)

    game.deck.add(...cards.map(CC => new CC()))
    
    cards = CardLibrary.sample(5, data.character.reduce((acc, set) => {
        acc[set] = 1.0
        return acc
    }, { Adventurer: 0.5 }), {
        F: 0.9,
        D: 0.5,
        C: 0.3,
        B: 0.1,
    }, seed)

    game.deck.add(...cards.map(CC => new CC()))

    startPath(dispatch, data.seed)
    generateFreedoms(dispatch)

})