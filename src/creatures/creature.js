import type { Effect } from "../effects/effect"
import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import { damage } from "../actions/damage"
import { RemoveCreature } from "../actions/removeCreature"
import { Listener } from "../actions/listener"
import { resolver } from "../actions/actionResolver";

const death = Symbol('death')
resolver.registerListenerType(death, [damage])

// export class Creature {
//     maxHealth: number
//     __health__: number
//     +effects: Effect[] // TODO: if this works, then should do everywhere
//     listener: ListenerGroup[]

//     color: string = '#992299'

//     constructor(health: number, maxHealth?: number){
//         this.maxHealth = maxHealth ? maxHealth : health
//         this.health = Math.min(health, this.maxHealth)
//         this.effects = []
//         this.listener = [(this.effects: any), new Listener(
//             death,
//             {
//                 type: damage,
//                 subjects: [this],
//             },
//             function({ resolver, subject }: ConsumerArgs<any, Creature>): void {
//                 if(!subject.health){
//                     resolver.pushActions(new RemoveCreature(subject, (subject: any), {}))
//                 }
//             },
//             false,
//         )] // TODO: add death detection?!?!? TODO: find a way to talk to flow here
//     }

// }   

export const creatureIds = (function*(): Generator<string, void, any, > {
    let i = 1
    while(i++){
        yield i.toString(26)
    }
})()

export type CreatureId = string
export type CreatureType = string

export interface Creature<D=any> {
    id: CreatureId,
    type: CreatureType,
    health: number,
    maxHealth: number,
    effects: Effect[],
    data: D,
}

export class CreatureWrapper<D=any> {

    // TODO: wont quite work because lifting needs to lift specific children. data will be this way, the  rest will be directly copied.
    inner: Creature<D>
    effects: Effect[] // TODO:

    // TODO: consider making this a shallow clone
    unWrap(){ return this.inner }
    
    set health(value: number){
        this.inner.health = Math.floor(Math.max(0, Math.min(this.inner.health, value)))
    }

    get health(): number {
        return this.inner.health
    }

    get listener(): ListenerGroup {
        // TODO: effects and death listener, I presume
        return [this.inner.effects] // TODO: add the death listener
    }

    is(other: Creature<> | CreatureWrapper<>): boolean {
        if(other instanceof CreatureWrapper){
            return other.inner.id == this.inner.id
        } else {
            return other.id == this.inner.id
        }
    }

    stacksOf(effectType: Symbol): number {
        let effects: Effect[] = this.inner.effects.filter(effect => effect.id == effectType)
        if(effects.length === 0){
            return 0
        } else {
            return effects[0].stacks
        }
    }

    constructor(representation: Creature<D>){
        this.inner = representation
        this.effects = representation.effects
    }

}




