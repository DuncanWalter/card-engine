import { definePragma } from './pragma'
import { C } from '../character'
import { Listener, ConsumerArgs } from '../events/listener'
import { resolver } from '../events/eventResolver'
import { defineListener } from '../events/defineListener'
import { StartCombat } from '../events/startCombat'
import { BindEffect } from '../events/bindEffect'
import { Redundancy } from '../effects/redundancy'

const snapshot = defineListener(
  'Snapshot',
  (owner) => ({
    type: StartCombat,
  }),
  (owner) =>
    function*({ game, resolver }: ConsumerArgs<>) {
      yield resolver.processEvent(
        new BindEffect(game.player, game.player, {
          Effect: Redundancy,
          stacks: 5,
        })
      )
    },
  [StartCombat]
)

export const Snapshot = definePragma('Snapshot', function*() {}, snapshot)
