import type { Card } from '../cards/card'
import type { Event } from './event'
import type { Effect } from '../effects/effect'
import type { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { ConsumerArgs, type ListenerType } from './listener'

type Type = {
  data: {
    Effect: { +type: ListenerType<any>, (stacks: number): Effect<any> },
    stacks: number,
  },
  subject: Card<> | Creature<>,
}

export const BindEffect = defineEvent('bindEffect', function*({
  subject,
  data,
}: ConsumerArgs<Type>) {
  let type = data.Effect(1).type
  let current = [...subject.effects].filter((effect) => effect.type == type)
  let effect: Effect<any> = current[0]
  // TODO: verify that floor is symmetric
  let stacks = Math.floor(data.stacks)

  if (current.length) {
    effect.stacks += stacks
    // TODO: FIGURE OUT HOW TO USE EFFECTS ELEGANTLY HERE
    // effect.stacks = Math.min(effect.stackBehavior.max, effect.stacks)
    if (effect.stacks <= 0) {
      subject.effects.splice(subject.effects.indexOf(effect), 1)
    }
  } else {
    let effect: Effect<any> = data.Effect(stacks)
    subject.effects.push(effect)
  }
})
