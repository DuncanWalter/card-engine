import type { NPC } from "./npc"
import type { GameState } from "../gameState"
import { Action } from "../actions/action"


// type BehaviorType = 'blade' | 'shield' | '' | 'diabolical' | 

// interface Data {
//     damage: number,

// }

// interface Appearance {
//     title: string,
//     color: string,

// }

export class Behavior<Meta: Object={}> {

    next(game: $ReadOnly<GameState>): Behavior<> {
        const next = this.production(game, this.seed)
        next.seed = this.seed
        return next
    }

    seed: number
    color: string = '#dd4444'
    textTemplate: (meta: Meta) => string
    name: string

    actions: (game: $ReadOnly<GameState>, self: NPC) => Action<>[]

    production: (state: $ReadOnly<GameState>, seed: number) => Behavior<>

    constructor(
        name: string,
        production: (state: $ReadOnly<GameState>, seed: number) => Behavior<>,
        actions: (game: $ReadOnly<GameState>, self: NPC) => Action<>[],
    ){
        this.production = production 
        this.name = name
        this.textTemplate = meta => name
        this.seed = 1 // TODO: prolly will be a twister
        this.actions = actions
    }

}
