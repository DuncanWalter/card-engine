import type { Effect } from "../effects/effect"
import type { ListenerGroup, ConsumerArgs, ListenerType } from '../events/listener'
import type { ID } from "../utils/entity"
import { RemoveCreature } from '../events/removeCreature'
import { Listener } from '../events/listener'
import { resolver } from '../events/eventResolver'
import { Entity } from "../utils/entity"
import { randomSequence, Sequence } from "../utils/random"
import { EffectGroup } from '../effects/effectGroup'
import { EffectState } from '../effects/effect'

export type CreatureType = string

export interface CreatureState {
    type: CreatureType,
    health: number,
    maxHealth: number,
    effects: ID<EffectState>[],
    seed: number,
}

export class Creature<D:Object=any> extends Entity<CreatureState & D> {

    get effects(): EffectGroup {
        return new EffectGroup(this.inner.effects)
    }

    get type(): CreatureType {
        return this.inner.type
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
        return this.effects.asListener(this)
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

    stacksOf(effectType: string | ListenerType<any>): number {
        let effects: EffectState[] = [...this.effects].filter(effect => effect.type == effectType)
        if(effects.length === 0){
            return 0
        } else {
            return effects[0].stacks
        }
    }

}




