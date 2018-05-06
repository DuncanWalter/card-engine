import { MetaCreature } from "../npc"
import { Behavior } from "../behavior"
import { Damage, targeted, blockable } from "../../actions/damage"
import { Block } from "../../effects/block"
import { BindEffect } from "../../actions/bindEffect"
import { startCombat } from "../../actions/startCombat"
import { Latency } from "../../effects/latency";
import { Strength } from "../../effects/strength"

let ribbit: Behavior, lick: Behavior, bite: Behavior

function next(seed: number): Behavior {
    console.log('seed', seed)
    switch(true){
        case seed < 0.3333: {
            return ribbit
        }
        case seed < 0.5555: {
            return lick
        }
        case seed < 1.0000: {
            return bite
        } 
    }
    return bite
}

ribbit = new Behavior('ribbit', next, function*({ owner, resolver, game }){
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

lick = new Behavior('lick', next, function*({ owner, resolver, game }){
    yield resolver.processAction(new BindEffect(owner, game.player, {
        Effect: Latency,
        stacks: 1,
    }))
    return { isDebuffing: true }
})

bite = new Behavior('bite', next, function*({ owner, resolver, game }){
    const action: Damage = yield resolver.processAction(new Damage(owner, game.player, { 
        damage: 6 
    }, targeted, blockable))
    return { damage: action.data.damage }
})

export const Toad = MetaCreature('toad', 15, bite, self => ({}) => {})
