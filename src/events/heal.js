import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { ConsumerArgs } from './listener'

type Type = {
  data: {
    healing: number,
  },
  subject: Creature<>,
}

export const Heal = defineEvent('heal', function*({
  data,
  subject,
  cancel,
}: ConsumerArgs<Type>) {
  data.healing = Math.floor(data.healing)
  if (data.healing <= 0) {
    cancel()
    return
  } else {
    subject.health += data.healing
  }
})
