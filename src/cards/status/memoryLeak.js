import { defineCard, Card, PlayArgs } from '../card'
import { defineEffect } from '../../effects/effect'
import { ExhaustCard } from '../../events/exhaustCard'
import { AddToHand } from '../../events/addToHand'
import { DrawCards } from '../../events/drawCards'
import { BindEnergy } from '../../events/bindEnergy'

const Drain = defineEffect(
  'drain',
  {
    name: 'Drain',
    innerColor: '#ee8866',
    outerColor: '#bb3322',
    description: 'On draw, lose 1 energy.',
    sides: 3,
    rotation: 0.5,
  },
  {
    stacked: false,
    delta: (x) => x,
    min: 1,
    max: 1,
  },
  (owner) => ({
    subjects: [owner],
    tags: [DrawCards],
    type: AddToHand,
  }),
  (owner, type) =>
    function*({ resolver, game }) {
      yield resolver.processEvent(
        new BindEnergy(owner, game.player, {
          quantity: -1,
        })
      )
    },
  [AddToHand]
)

export const MemoryLeak = defineCard(
  'memoryLeak',
  function*(self: Card<>, { energy }: PlayArgs) {
    return { energy }
  },
  {
    energy: undefined,
  },
  {
    color: '111122',
    text: '#[Unplayable]. On draw, lose 1 energy.',
    title: 'Memory Leak',
  },
  [Drain, 1]
)
