import { MetaCreature } from "../npc"
import { Behavior } from "../behavior"
import { Damage, targeted } from "../../actions/damage"
import { blockable, block } from "../../effects/block"
import { BindEffect } from "../../actions/bindEffect"
import { startCombat } from "../../actions/startCombat"

let chomp, hunker

chomp = new Behavior('chomp', any => hunker, (game, self) => [
    new Damage(self, game.player, { damage: 7 }, targeted, blockable),
])

hunker = new Behavior('hunker', any => chomp, (game, self) => [
    new BindEffect(self, self, {
        effect: block,
        stacks: 6,
    })
])

export const Turtle = MetaCreature('turtle', 15, chomp, self => ({ resolver, actor }) => {
    console.log(actor)
    resolver.enqueueActions(new BindEffect(self, self, {
        effect: block,
        stacks: 25,
    }))
})
