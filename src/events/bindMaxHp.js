import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import type { Player } from '../creatures/player'
import { defineEvent } from './event'
import { ConsumerArgs } from './listener'

type Type = {
  data: {
    points: number,
  },
  subject: Player,
}

export const BindMaxHp = defineEvent('bindMaxHp', function*({
  data,
  subject,
  cancel,
}: ConsumerArgs<Type>) {
  subject.health += Math.floor(data.points)
  subject.inner.maxHealth += Math.floor(data.points)
})
