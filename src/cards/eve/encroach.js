import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted, Damage } from '../../events/damage'
import { AddToHand } from '../../events/addToHand'
import { Jab } from './jab'
import { defineEffect } from '../../effects/effect'
import { EndTurn } from '../../events/turnActions'
import { Listener } from '../../events/listener'

type EncroachData = BasicCardData & { rage: number }

export const encroach = 'encroach'
export const Encroach: () => Card<EncroachData> = defineCard(
  encroach,
  playEncroach,
  {
    rage: 3,
    energy: 0,
  },
  {
    color: '#88aa33',
    title: 'Encroach',
    text:
      'Gain #{block} block whenever you deal damage until the end of your turn.',
  }
)

function* playEncroach(
  self: Card<EncroachData>,
  { actors, resolver, game, energy }: PlayArgs
): Generator<any, EncroachData, any> {
  const action: BindEffect = yield resolver.processEvent(
    new BindEffect(actors, game.player, {
      Effect: EncroachEffect,
      stacks: self.data.rage,
    })
  )
  return { rage: action.data.stacks, energy }
}

const EncroachEffect = defineEffect(
  encroach,
  {
    description: 'Upon dealing damage, gain #{stacks} block.',
    innerColor: '#aacc44',
    outerColor: '#889911',
    name: 'Encroach',
    sides: 6,
  },
  {
    stacked: true,
    delta: (n) => 0,
    min: 1,
    max: 99,
    on: EndTurn,
  },
  (owner) => ({
    actors: [owner],
    type: Damage,
  }),
  (owner, type) =>
    function*({ resolver, actors }): * {
      yield resolver.processEvent(
        new BindEffect(
          actors,
          owner,
          {
            stacks: owner.stacksOf(type),
            Effect: Block,
          },
          Block,
          type
        )
      )
    },
  [],
  [Damage]
)
