import type { ListenerGroup } from "../events/listener"
import type { Entity, ID } from "../utils/entity"
import { Effect, EffectState } from "./effect"
import { EntityGroup } from "../utils/entityGroup";

export class EffectGroup extends EntityGroup<Effect<any>> {

    constructor(effects: ID<EffectState>[]){
        super(Effect, effects)
    }

    asListener(owner: Entity<any>): ListenerGroup {
        return this.ids.map(id => new Effect(id).asListener(owner)) 
    }

}
