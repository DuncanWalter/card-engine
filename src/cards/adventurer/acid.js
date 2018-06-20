import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted, blockable } from './../../events/damage'
import { Listener, ConsumerArgs } from '../../events/listener'
import { BindEffect } from '../../events/bindEffect'
import { Vulnerability } from '../../effects/vulnerability'
import { Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { Corruption } from '../../effects/corruption'
import { queryEnemy } from '../utils'

type AcidData = BasicCardData & { damage: number }

export const acid = 'acid'
export const Acid: () => Card<AcidData> = defineCard(
  acid,
  playAcid,
  {
    damage: 4,
    energy: 1,
    playable: true,
  },
  {
    color: '#eeff33',
    title: 'Acid',
    text: 'Deal #{damage} damage. Convert blocked damage to poison.',
  }
)

function* playAcid(
  self: Card<AcidData>,
  { game, resolver, actors, energy }: PlayArgs
) {
  let target = yield queryEnemy(game)
  if (target instanceof Creature) {
    const action: Damage = new Damage(
      actors,
      target,
      {
        damage: self.data.damage,
      },
      targeted,
      blockable
    )
    action.defaultListeners.push(
      new Listener(
        Block.type,
        {},
        function*({
          internal,
          data,
          actors,
          subject,
          resolver,
          next,
        }: ConsumerArgs<>): Generator<any, any, any> {
          const damage = data.damage
          yield internal()
          const poison = damage - data.damage
          yield next()
          yield resolver.processEvent(
            new BindEffect(actors, subject, {
              Effect: Corruption,
              stacks: poison,
            })
          )
        },
        true
      )
    )
    yield resolver.processEvent(action)
    return {
      playable: true,
      damage: action.data.damage,
      energy: energy,
    }
  } else {
    return self.data
  }
}
