import type { Event } from './event'
import type { Player } from '../creatures/player'
import { defineEvent } from './event'
import { ConsumerArgs } from './listener'

type Type = {
  data: {
    quantity: number,
  },
  subject: Player,
}

export const BindEnergy = defineEvent('bindEnergy', function*({
  game,
  data,
}: ConsumerArgs<Type>) {
  game.player.energy += Math.floor(data.quantity)
})
