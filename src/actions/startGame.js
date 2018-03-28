import type { CustomAction } from "./action"

import { MetaAction } from "./action"
import { bind } from "../components/battle/battleState"
import { Player } from "../creatures/player"
import { CardLibrary } from "../cards/cardLibrary"
import { ConsumerArgs } from "./listener"
import { StartCombat } from "./startCombat"
// <{ loadFile?: string }> // TODO: data for card pool selection etc
export const startGame: Symbol = Symbol('startGame')
export const StartGame: CustomAction<> = MetaAction(startGame, ({ resolver }: ConsumerArgs<>): void => {
    bind(game => {
        game.player = new Player(65/*/, 'fighter', 'acrobat' // Monk /*/)
        game.deck.clear()
        game.deck.add(...[...CardLibrary.sample(2)].map(CC => new CC()))
        game.deck.add(...[...CardLibrary.sample(2)].map(CC => new CC()))
        game.deck.add(...[...CardLibrary.sample(3)].map(CC => new CC()))
        game.deck.add(...[...CardLibrary.sample(3)].map(CC => new CC()))
        console.log(game.deck.cards)
        return game
    })
})