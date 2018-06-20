import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../events/damage'
import { AddToHand } from '../../events/addToHand'
import { Jab } from './jab'
import { defineEffect } from '../../effects/effect'
import { EndTurn } from '../../events/turnActions'
import { Listener } from '../../events/listener'
import { Strength } from '../../effects/strength'
import { upgrade } from '../utils'

type FlexData = BasicCardData & { flex: number, keep: boolean }

export const flex = 'flex'
export const Flex: () => Card<FlexData> = defineCard(
  flex,
  playFlex,
  {
    flex: 2,
    energy: 0,
    keep: 0,
  },
  {
    color: '#cc6633',
    title: 'Flex',
    text: 'Gain #{flex} #[Strength]. On end turn, lose #{flex} #[Strength].',
  }
)

function* playFlex(
  self: Card<FlexData>,
  { actors, resolver, game, energy }: PlayArgs
): Generator<any, FlexData, any> {
  const action: BindEffect = yield resolver.processEvent(
    new BindEffect(actors, game.player, {
      Effect: FlexEffect,
      stacks: self.data.flex,
    })
  )
  yield resolver.processEvent(
    new BindEffect(actors, game.player, {
      Effect: Strength,
      stacks: self.data.flex,
    })
  )
  return { ...self.data, flex: action.data.stacks, energy }
}

export const FlexPermanent = upgrade(
  'L',
  Flex,
  { keep: true, flex: 1 },
  { text: 'Gain #{flex} #[Strength].' }
)
export const FlexImproved = upgrade('R', Flex, { flex: 4 })

const FlexEffect = defineEffect(
  'flex',
  {
    description: 'On end turn, lose #{stacks} #[Strength].',
    innerColor: '#aacc44',
    outerColor: '#889911',
    name: 'Flex',
    sides: 3,
  },
  {
    stacked: true,
    delta: (n) => 0,
    min: 1,
    max: 99,
    on: EndTurn,
  },
  (owner) => ({
    subject: owner,
    type: EndTurn,
  }),
  (owner, type) =>
    function*({ resolver }) {
      yield resolver.processEvent(
        new BindEffect(
          owner,
          owner,
          {
            stacks: -owner.stacksOf(type),
            Effect: Strength,
          },
          Block,
          'flex'
        )
      )
    },
  [],
  [EndTurn]
)
