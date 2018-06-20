import type { Card } from '../cards/card'
import type { Event } from './event'
import { Creature } from '../creatures/creature'
import { defineEvent } from './event'

export const TakeTurn = defineEvent('takeTurn', function*({
  game,
  subject,
  resolver,
}): * {
  yield subject.takeTurn(resolver, game)
})
