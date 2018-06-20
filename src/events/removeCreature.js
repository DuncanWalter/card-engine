import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { EndCombat } from './endCombat'
import { ConsumerArgs } from './listener'

type Type = {
  subject: Creature<>,
  data: any,
}

export const RemoveCreature = defineEvent('removeCreature', function*({
  game,
  actors,
  subject,
  resolver,
}: ConsumerArgs<Type>) {
  let index
  console.log(subject)
  console.log('killing... something...', game.enemies)
  console.log(game.enemies.entities.includes(subject))
  console.log(
    game.enemies.entities.map((enemy) => enemy.id).includes(subject.id)
  )
  switch (true) {
    case game.player == subject: {
      // rip
      resolver.pushEvents(new EndCombat(actors, subject, {}))
      break
    }
    case game.enemies.includes(subject): {
      // check if it all ends
      console.log('killed a foe')
      game.enemies.remove(subject)
      if (!game.enemies.size) {
        resolver.pushEvents(new EndCombat(actors, subject, {}))
      }
      break
    }
    case game.allies.includes(subject): {
      game.allies.remove(subject)
      break
    }
  }
})
