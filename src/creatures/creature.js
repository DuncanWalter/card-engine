import type { Effect } from "../effects/effect"
import type { ListenerGroup, ConsumerArgs } from '../events/listener'
import { damage } from '../events/damage'
import { RemoveCreature } from '../events/removeCreature'
import { Listener } from '../events/listener'
import { resolver } from '../events/eventResolver'
import { Entity } from "../utils/entity"
import { randomSequence, Sequence } from "../utils/random"
import { EffectGroup } from '../effects/effectGroup'
import { EffectState } from '../effects/effect'

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

export type CreatureType = string

export interface CreatureState<D=any> {
    type: CreatureType,
    health: number,
    maxHealth: number,
    effects: EffectState[],
    seed: number,
    data: D,
}

export class Creature<D=any> extends Entity<CreatureState<D>> {

    get effects(): EffectGroup {
        return new EffectGroup(this.inner.effects)
    }
    
    set health(value: number){
        this.inner.health = Math.floor(Math.max(0, Math.min(this.inner.maxHealth, value)))
    }
    get health(): number {
        return this.inner.health
    }

    set maxHealth(value: number){
        this.inner.maxHealth = Math.floor(Math.max(0, value))
    }
    get maxHealth(): number {
        return this.inner.maxHealth
    }

    get listener(): ListenerGroup {
        // TODO: effects and death listener, I presume
        return this.effects.asListener(this) // TODO: add the death listener
    }

    get seed(): Sequence<number> {
        const self = this
        return {
            next(): number {
                let rand = randomSequence(self.inner.seed)
                let ret = rand.next()
                self.inner.seed = rand.last()
                return ret
            },
            fork(){
                return randomSequence(self.inner.seed)
            },
            last(){
                return self.inner.seed
            },
        }
    }

    set seed(seed: Sequence<number>){
        this.inner.seed = seed.last()
    }

    stacksOf(effectType: Symbol): number {
        let effects: EffectState[] = this.inner.effects.filter(effect => effect.type == effectType.toString())
        if(effects.length === 0){
            return 0
        } else {
            return effects[0].stacks
        }
    }

}




