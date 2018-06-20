import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { history } from '../utils/navigation'

export const EndCombat = defineEvent('endCombat', function*({
  game,
  subject,
  resolver,
}) {
  if (game.player.health > 0) {
    game.player.inner.isActive = false

    game.player.effects.splice(0, game.player.effects.length)

    history.push('/game/rewards/')
  } else {
    history.push('/menu/main')
  }
})
