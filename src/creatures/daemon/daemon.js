import type { BehaviorState } from '../behavior'
import { Damage, targeted, blockable } from '../../events/damage'
import { Block } from '../../effects/block'
import { BindEffect } from '../../events/bindEffect'
import { Blockade } from '../../effects/blockade'
import { Listener } from '../../events/listener'
import { Latency } from '../../effects/latency'
import { defineBehavior } from '../behavior'
import { defineMonster } from '../monster'
import { pickTarget } from '../utils'

const scratch: BehaviorState = defineBehavior('Daemon Swipe', function*({
  owner,
  resolver,
  game,
}) {
  let action: Damage = new Damage(
    owner,
    pickTarget(game, owner),
    {
      damage: 5,
    },
    targeted,
    blockable
  )

  yield resolver.processEvent(action)
  return { damage: action.data.damage }
})

export const Daemon = defineMonster('Daemon', 15, () => scratch)
