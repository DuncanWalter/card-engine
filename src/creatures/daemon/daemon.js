import type { BehaviorType } from "../behavior"
import { Damage, targeted, blockable, damage } from "../../actions/damage"
import { Block } from "../../effects/block"
import { BindEffect } from "../../actions/bindEffect"
import { startCombat } from "../../actions/startCombat"
import { Blockade } from "../../effects/blockade"
import { Listener } from "../../actions/listener"
import { Poison } from "../../effects/poison"
import { Latency } from "../../effects/latency"
import { defineBehavior } from "../behavior"
import { defineMonster } from "../monster";

const scratch: BehaviorType = defineBehavior('Swipe', function*({ owner, resolver, game }){
    let action: Damage = new Damage(owner, game.player, { 
        damage: 5
    }, targeted, blockable)
    
    yield resolver.processAction(action)
    return { damage: action.data.damage }
})

export const Daemon = defineMonster('Daemon', 15, () => scratch)
