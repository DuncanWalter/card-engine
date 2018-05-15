import type { BehaviorType } from "./behavior"
import { defineBehavior } from "./behavior"
import { BindEffect } from '../events/bindEffect'
import { Imperturbability } from "../effects/inperturbability";
import { Invulnerability } from "../effects/invulnerability";
import { defineMonster } from "./monster";

let rest: BehaviorType = defineBehavior('Rest', function*(){ return {} })

export const TrainingDummy = defineMonster('Training Dummy', 10, () => rest, self => {
    self.effects.push(
        new Imperturbability(self, 1),
        new Invulnerability(self, 1),
    )
    return self
})
