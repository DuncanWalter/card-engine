import type { CustomAction } from "./action"
import { MetaAction } from "./action"
import { PlayerWrapper } from "../creatures/player"
import { CardLibrary } from "../cards/cardLibrary"
import { ConsumerArgs } from "./listener"
import { TrainingDummy } from "../creatures/trainingDummy"
import { dispatch } from "../state"
import { startPath, generateFreedoms } from "../paths/pathState"
import { Sequence, randomSequence } from "../utils/random"
import { Strike } from "../cards/adventurer/strike";
import { Defend } from "../cards/adventurer/defend";
import { creatureIds } from "../creatures/creature";
import { MonsterWrapper } from "../creatures/monster";

// <{ loadFile?: string }> // TODO: data for card pool selection etc
export const startGame: Symbol = Symbol('startGame')
export const StartGame: CustomAction<{ seed: number, character: string[] }> = MetaAction(startGame, ({ resolver, game, data }: ConsumerArgs<{ seed: number, character: string[] }>): void => {
    
    let seed = randomSequence(data.seed * Math.random())

    // TODO: set up the training dummy
    game.dummy = new TrainingDummy(randomSequence(1))
    game.player = new PlayerWrapper({
        type: '',
        id: creatureIds.next().value || '',
        health: 65,
        maxHealth: 65,
        effects: [],
        data: {
            energy: 3,
            isActive: true,
            sets: [...data.character],
        },
    })
    game.deck.clear()
    game.drawPile.clear()
    game.hand.clear()
    game.discardPile.clear()
    game.exhaustPile.clear()
    game.enemies = []
    game.allies = []
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
    }, {
        Adventurer: 0.5,
    }), {
        F: 0.9,
        D: 0.5,
        C: 0.3,
        B: 0.1,
    }, seed)

    game.deck.add(...cards.map(CC => new CC()))

    startPath(dispatch, data.seed)
    generateFreedoms(dispatch)

})