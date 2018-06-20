import { defineCard, PlayArgs, Card } from '../card'
import { defineEffect } from '../../effects/effect'
import { ExhaustCard } from '../../events/exhaustCard'

const Indestructible: * = defineEffect(
  'indestructible',
  {
    name: 'Indestructible',
    innerColor: '#ee8866',
    outerColor: '#bb3322',
    description: 'Cannot be #[Destroyed].',
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
    type: ExhaustCard,
  }),
  (owner, type) =>
    function*({ cancel }) {
      return cancel()
    },
  [],
  [ExhaustCard]
)

export const HardwareFailure = defineCard(
  'hardwareFailure',
  function*(self: Card<>, { energy }: PlayArgs) {
    return { energy }
  },
  {
    energy: undefined,
  },
  {
    color: '#884422',
    text: '#[Unplayable]. #[Indestructible].',
    title: 'Hardware Failure',
  },
  [Indestructible, 1]
)
