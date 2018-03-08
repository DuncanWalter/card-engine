import type { Effect } from "../effects/effect"
import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import { damage } from "../actions/damage"
import { gameSlice } from "../gameState"
import { RemoveCreature } from "../actions/removeCreature"
import { Listener } from "../actions/listener"

const death = Symbol('death')
gameSlice.resolver.registerListenerType(death, [damage])

export class Creature {
    maxHealth: number
    __health__: number
    effects: Effect[] // TODO: if this works, then should do everywhere
    listener: ListenerGroup[]

    color: string = '#992299'

    constructor(health: number, maxHealth?: number){
        this.maxHealth = maxHealth ? maxHealth : health
        this.health = Math.min(health, this.maxHealth)
        this.effects = []
        this.listener = [(this.effects: any), new Listener(
            death,
            {
                type: damage,
                subjects: [this],
            },
            function({ resolver, subject }: ConsumerArgs<any, Creature>): void {
                console.log('did it die?', subject.health)
                if(!subject.health){
                    console.log('it did!')
                    resolver.pushActions(new RemoveCreature(subject, (subject: any), {}))
                }
            },
            false,
        )] // TODO: add death detection?!?!? TODO: find a way to talk to flow here
    }

    set health(value: number){
        this.__health__ = Math.floor(Math.max(0, Math.min(this.maxHealth, value)))
    }

    get health(): number {
        return this.__health__
    }

}   
