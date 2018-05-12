import type { BehaviorType } from "../behavior"
import { Behavior, defineBehavior, primeBehavior } from "../behavior"
import { Damage, targeted, blockable, damage } from "../../actions/damage"
import { Block } from "../../effects/block"
import { BindEffect } from "../../actions/bindEffect"
import { startCombat } from "../../actions/startCombat"
import { Blockade } from "../../effects/blockade"
import { Listener } from "../../actions/listener"
import { Poison } from "../../effects/poison"
import { Latency } from "../../effects/latency"
import { defineMonster } from "../monster";

const bite: BehaviorType = defineBehavior('Bite', function*({ owner, resolver, game }){
    let action: Damage = new Damage(owner, game.player, { 
        damage: 9 
    }, targeted, blockable)
    // deals poison on-hit
    action.defaultListeners.push(new Listener(
        damage, 
        {},
        function*({ data, resolver, actors, subject, internal }): * {
            yield internal()
            if(data.damage > 0){
                yield resolver.processAction(new BindEffect(actors, subject, {
                    Effect: Poison,
                    stacks: 3,
                }))
            }
        },
        true,
    ))
    yield resolver.processAction(action)
    return { damage: action.data.damage, isDebuffing: true }
})

const hiss: BehaviorType = defineBehavior('Hiss', function*({ owner, resolver, game }){
    yield resolver.processAction(new BindEffect(owner, game.player, {
        Effect: Latency,
        stacks: 2,
    }))
    return { isDebuffing: true }
})

function behaviorSwitch(last, seed){
    switch(true){
        case last == primeBehavior:{
            return seed.next() > 0.35 ? bite : hiss
        }
        case last == bite:{
            return seed.next() > 0.35 ? hiss : bite
        }
        case last == hiss:{
            return bite
        }
        default:{
            return bite
        }
    }
}

export const Cobra = defineMonster('Cobra', 30, behaviorSwitch)
