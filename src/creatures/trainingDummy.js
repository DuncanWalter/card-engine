import type { BehaviorState } from './behavior'
import { defineBehavior } from './behavior'
import { BindEffect } from '../events/bindEffect'
import { Imperturbability } from '../effects/inperturbability'
import { Invulnerability } from '../effects/invulnerability'
import { defineMonster } from './monster'

let rest: BehaviorState = defineBehavior('Training Dummy Rest', function*() {
  return {}
})

export const TrainingDummy = defineMonster(
  'Training Dummy',
  10,
  () => rest,
  (self) => {
    self.effects.push(Imperturbability(1), Invulnerability(1))
    return self
  }
)
