import { definePragma } from './pragma'
import { C } from '../character'
import { Listener, ConsumerArgs } from '../events/listener'
import { BindEnergy } from '../events/bindEnergy'
import { DrawCards } from '../events/drawCards'
import { resolver } from '../events/eventResolver'
import { defineListener } from '../events/defineListener'
import { StartTurn } from '../events/turnActions'
import { StartCombat } from '../events/startCombat'

const lookAhead = defineListener(
  'LookAhead',
  (owner) => ({
    type: StartTurn,
    subjects: [owner],
    tags: [StartCombat],
  }),
  (owner) =>
    function*({ game, resolver }: ConsumerArgs<>) {
      yield resolver.processEvent(
        new BindEnergy(owner, game.player, {
          quantity: 1,
        })
      )
      yield resolver.processEvent(
        new DrawCards(owner, game.player, {
          count: 1,
        })
      )
    },
  [StartTurn]
)

export const LookAhead = definePragma('LookAhead', function*() {}, lookAhead)
