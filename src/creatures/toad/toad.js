import type { BehaviorType } from "../behavior"
import { Behavior, defineBehavior } from "../behavior"
import { Damage, targeted, blockable } from "../../actions/damage"
import { Block } from "../../effects/block"
import { BindEffect } from "../../actions/bindEffect"
import { startCombat } from "../../actions/startCombat"
import { Latency } from "../../effects/latency";
import { Strength } from "../../effects/strength"
import { defineMonster } from "../monster";
import { Sequence } from "../../utils/random";

const ribbit: BehaviorType = defineBehavior('Ribbit', function*({ owner, resolver, game }){
    yield resolver.processAction(new BindEffect(owner, owner, { 
        stacks: 5,
        Effect: Block,
    }, targeted))
    yield resolver.processAction(new BindEffect(owner, owner, { 
        stacks: 1,
        Effect: Strength,
    }, targeted))
    return { defending: true, buffing: true }
})

const lick: BehaviorType = defineBehavior('Lick', function*({ owner, resolver, game }){
    yield resolver.processAction(new BindEffect(owner, game.player, {
        Effect: Latency,
        stacks: 1,
    }))
    return { isDebuffing: true }
})

const bite: BehaviorType = defineBehavior('Bite', function*({ owner, resolver, game }){
    const action: Damage = yield resolver.processAction(new Damage(owner, game.player, { 
        damage: 6 
    }, targeted, blockable))
    return { damage: action.data.damage }
})

function next(last: BehaviorType, seed: Sequence<number>): BehaviorType {
    const next = seed.next()
    switch(true){
        case next < 0.3333: {
            return ribbit
        }
        case next < 0.5555: {
            return lick
        }
        case next < 1.0000: {
            return bite
        } 
    }
    return bite
}

export const Toad = defineMonster('Toad', 15, next)
