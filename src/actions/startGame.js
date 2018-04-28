import type { CustomAction } from "./action"
import { MetaAction } from "./action"
import { Player } from "../creatures/player"
import { CardLibrary } from "../cards/cardLibrary"
import { ConsumerArgs } from "./listener"
import { TrainingDummy } from "../creatures/trainingDummy"
import { dispatch } from "../state"
import { startPath, generateFreedoms } from "../paths/pathState"
import { Sequence, randomSequence } from "../utils/random"
import { Strike } from "../cards/adventurer/strike";
import { Defend } from "../cards/adventurer/defend";

// <{ loadFile?: string }> // TODO: data for card pool selection etc
export const startGame: Symbol = Symbol('startGame')
export const StartGame: CustomAction<{ seed: number }> = MetaAction(startGame, ({ resolver, game, data }: ConsumerArgs<{ seed: number }>): void => {
    
    let seed = randomSequence(data.seed * Math.random())

    game.dummy = new TrainingDummy(10)
    game.player = new Player(65) /*/, 'fighter', 'acrobat' // Monk /*/
    game.deck.clear()
    game.drawPile.clear()
    game.hand.clear()
    game.discardPile.clear()
    game.exhaustPile.clear()
    game.enemies = []
    game.allies = []
    game.equipment = []
    // game.deck.add(new Strike(), new Strike(), new Strike())
    // game.deck.add(new Defend(), new Defend(), new Defend())
    game.deck.add(...[...CardLibrary.sample(10, seed)].map(CC => new CC()))

    startPath(dispatch, data.seed)
    generateFreedoms(dispatch)

})