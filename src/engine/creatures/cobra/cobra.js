import { MetaCreature } from "../npc"
import { Behavior } from "../behavior"
import { Damage, targeted, blockable, damage } from "../../actions/damage"
import { Block } from "../../effects/block"
import { BindEffect } from "../../actions/bindEffect"
import { startCombat } from "../../actions/startCombat"
import { Blockade } from "../../effects/blockade"
import { Listener } from "../../actions/listener"
import { Poison } from "../../effects/poison"
import { Weakness } from "../../effects/weakness"

let bite: Behavior, hiss: Behavior

bite = new Behavior('Bite', seed => seed > 0.5 ? bite : hiss, function*({ owner, resolver, game }){
    let action: Damage = new Damage(owner, game.player, { 
        damage: 9 
    }, targeted, blockable)
    // deals poison on-hit
    action.defaultListeners.push(new Listener(
        damage, 
        {},
        function*({ data, resolver, actor, subject, internal }): * {
            console.log('WAZZUP SNAKEY?')
            yield internal()
            if(data.damage > 0){
                yield resolver.processAction(new BindEffect(actor, subject, {
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

hiss = new Behavior('Hiss', seed => seed > 0.5 ? bite : hiss, function*({ owner, resolver, game }){
    yield resolver.processAction(new BindEffect(owner, game.player, {
        Effect: Weakness,
        stacks: 2,
    }))
    return { isDebuffing: true }
})

export const Cobra = MetaCreature('Cobra', 30, hiss, self => ({}) => {})
