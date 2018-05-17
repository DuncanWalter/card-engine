import type { BehaviorType } from "../behavior"
import { Behavior, defineBehavior, primeBehavior } from "../behavior"
import { Damage, targeted, blockable, damage } from '../../events/damage'
import { Block } from "../../effects/block"
import { BindEffect } from '../../events/bindEffect'
import { startCombat } from '../../events/startCombat'
import { Blockade } from "../../effects/blockade"
import { Listener } from '../../events/listener'
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
        function*({ data, resolver, actors, subject, internal }){
            yield internal()
            if(typeof data.damage == 'number' && data.damage >= 0){
                yield resolver.processEvent(new BindEffect(actors, subject, {
                    Effect: Poison,
                    stacks: 3,
                }))
            }
        },
        true,
    ))
    yield resolver.processEvent(action)
    return { damage: action.data.damage, isDebuffing: true }
})

const hiss: BehaviorType = defineBehavior('Hiss', function*({ owner, resolver, game }){
    yield resolver.processEvent(new BindEffect(owner, game.player, {
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
