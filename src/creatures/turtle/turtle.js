import { MetaCreature } from "../npc"
import { Behavior } from "../behavior"
import { Damage, targeted, blockable } from "../../actions/damage"
import { Block } from "../../effects/block"
import { BindEffect } from "../../actions/bindEffect"
import { startCombat } from "../../actions/startCombat"
import { Blockade } from "../../effects/blockade"

let chomp: Behavior, hunker: Behavior

chomp = new Behavior('chomp', seed => hunker, function*({ owner, resolver, game }){
    const action: Damage = yield resolver.processAction(new Damage(self, game.player, { 
        damage: 7 
    }, targeted, blockable))
    return { damage: action.data.damage }
})

hunker = new Behavior('hunker', seed => chomp, function*({ owner, resolver, game }){
    yield resolver.processAction(new BindEffect(owner, owner, {
        Effect: Block,
        stacks: 8,
    }))
    return { isDefending: true }
})

export const Turtle = MetaCreature('turtle', 15, chomp, self => ({ resolver, actor }) => {
    resolver.enqueueActions(new BindEffect(self, self, {
        Effect: Blockade,
        stacks: 1,
    }))
    resolver.enqueueActions(new BindEffect(self, self, {
        Effect: Block,
        stacks: 25,
    }))
})
