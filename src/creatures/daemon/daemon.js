import type { BehaviorState } from "../behavior"
import { Damage, targeted, blockable, damage } from '../../events/damage'
import { Block } from "../../effects/block"
import { BindEffect } from '../../events/bindEffect'
import { startCombat } from '../../events/startCombat'
import { Blockade } from "../../effects/blockade"
import { Listener } from '../../events/listener'
import { Poison } from "../../effects/poison"
import { Latency } from "../../effects/latency"
import { defineBehavior } from "../behavior"
import { defineMonster } from "../monster";

const scratch: BehaviorState = defineBehavior('Daemon Swipe', function*({ owner, resolver, game }){
    let action: Damage = new Damage(owner, game.player, { 
        damage: 5
    }, targeted, blockable)
    
    yield resolver.processEvent(action)
    return { damage: action.data.damage }
})

export const Daemon = defineMonster('Daemon', 15, () => scratch)
