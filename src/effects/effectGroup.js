import type { ListenerGroup } from "../events/listener";
import { Effect, EffectState } from "./effect";
import { Entity } from "../utils/entity";

export class EffectGroup {

    effects: EffectState[]

    constructor(effects: EffectState[]){
        this.effects = effects
    }

    add(...effects: Effect[]){
        this.effects.push(...effects.map(effect => effect.unwrap()))
    }

    remove(effect: Effect){
        let index
        if((index = effect.isIn(this.effects)) >= 0){
            this.effects.splice(index, 1)
        }
    }

    asListener(owner: Entity<any>): ListenerGroup {
        return this.effects.map(effect => new Effect(effect).asListener(owner)) 
    }

    clear(){
        this.effects.splice(0, this.effects.length)
    }

}










