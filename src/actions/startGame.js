import type { CustomAction } from "./action"

import { MetaAction } from "./action"
import { bind } from "../game/battle/battleState"
import { Player } from "../creatures/player"
import { CardLibrary } from "../cards/cardLibrary"
import { ConsumerArgs } from "./listener"
import { TrainingDummy } from "../creatures/trainingDummy";

// <{ loadFile?: string }> // TODO: data for card pool selection etc
export const startGame: Symbol = Symbol('startGame')
export const StartGame: CustomAction<> = MetaAction(startGame, ({ resolver }: ConsumerArgs<>): void => {
    bind(game => {
        game.dummy = new TrainingDummy(10)
        game.player = new Player(65/*/, 'fighter', 'acrobat' // Monk /*/)
        game.deck.clear()
        game.drawPile.clear()
        game.hand.clear()
        game.discardPile.clear()
        game.exhaustPile.clear()
        game.enemies = []
        game.allies = []
        game.equipment = []
        game.deck.add(...[...CardLibrary.sample(2)].map(CC => new CC()))
        game.deck.add(...[...CardLibrary.sample(4)].map(CC => new CC()))
        game.deck.add(...[...CardLibrary.sample(4)].map(CC => new CC()))
        // game.deck.add(...[...CardLibrary.sample(3)].map(CC => new CC()))
        // console.log(game.deck.cards)
        return game
    })
})