import { MetaCreature } from "./npc"
import { Behavior } from "./behavior"
import { BindEffect } from "../actions/bindEffect"
import { Imperturbability } from "../effects/inperturbability";
import { Invulnerability } from "../effects/invulnerability";

let rest = new Behavior('rest', any => rest, () => ({}))

export const TrainingDummy = MetaCreature('Training Dummy', 10, rest, self => ({ resolver, actor }) => {
    resolver.enqueueActions(new BindEffect(self, self, {
        Effect: Invulnerability,
        stacks: 1,
    }))
    resolver.enqueueActions(new BindEffect(self, self, {
        Effect: Imperturbability,
        stacks: 1,
    }))
})
