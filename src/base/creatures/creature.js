import type { Effect } from "../effects/effect"
import type { Listeners } from "../actions/actionResolver"

export class Creature {
    maxHealth: number
    __health__: number
    effects: Effect[] // TODO: if this works, then should do everywhere
    listener: Listeners

    color: string = '#992299'

    constructor(health: number, maxHealth?: number){
        this.maxHealth = maxHealth ? maxHealth : health
        this.health = Math.min(health, this.maxHealth)
        this.effects = []
        this.listener = [(this.effects: any)] // TODO: add death detection?!?!? TODO: find a way to talk to flow here
    }

    set health(value: number){
        this.__health__ = Math.floor(Math.max(0, Math.min(this.maxHealth, value)))
    }

    get health(): number {
        return this.__health__
    }

}   
