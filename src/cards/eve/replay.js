import { BasicCardData, defineCard, Card, PlayArgs } from '../card'
import { defineEffect } from '../../effects/effect'
import { PlayCard } from '../../events/playCard'
import { EndTurn } from '../../events/turnActions'
import { AddToDiscardPile } from '../../events/addToDiscardPile'
import { BindEffect } from '../../events/bindEffect'
import { AddToDrawPile } from '../../events/addToDrawPile'
import { ExhaustCard } from '../../events/exhaustCard'
import { Block } from '../../effects/block'
import { targeted } from '../../events/damage'

type ReplayData = BasicCardData & { block: number, inHand: boolean }

export const Replay = defineCard(
  'replay',
  playReplay,
  {
    energy: 1,
    block: 4,
    inHand: false,
  },
  {
    title: 'Replay',
    text:
      'Gain #{block} block. On next play card, place card on top of draw pile.',

    color: '#dd7712',
  }
)

// TODO: add upgraded logic
function* playReplay(
  self: Card<ReplayData>,
  { energy, game, actors, resolver }: PlayArgs
) {
  const action = new BindEffect(
    actors,
    game.player,
    {
      Effect: Block,
      stacks: self.data.block,
    },
    Block,
    targeted
  )

  const bind = new BindEffect(
    actors,
    game.player,
    {
      Effect: ReplayEffectDP,
      stacks: 1,
    },
    ReplayEffectDP,
    targeted
  )

  yield resolver.processEvent(action)
  yield resolver.processEvent(bind)

  return {
    ...self.data,
    block: action.data.stacks,
    energy,
  }
}

const ReplayEffectH = defineEffect(
  'replayHand',
  {
    description:
      'The next #{stacks} cards played will be returned to your hand.',
    name: 'Replay',
    innerColor: '#dd7712',
    outerColor: '#dd7712',
    sides: 13,
  },
  {
    stacked: true,
    delta: (x) => 0,
    on: EndTurn,
    min: 1,
    max: 99,
  },
  (owner) => ({
    type: AddToDiscardPile,
    actors: [owner],
    tags: [PlayCard],
  }),
  (owner, type) =>
    function*({ data, resolver, cancel, actors, subject }) {
      const loss = new BindEffect(actors, owner, {
        Effect: ReplayEffectH,
        stacks: -1,
      })

      const place = new AddToDrawPile(actors, subject, {})

      yield resolver.processEvent(loss)
      yield resolver.processEvent(place)

      return cancel()
    },
  [ExhaustCard],
  [AddToDiscardPile]
)

const ReplayEffectDP = defineEffect(
  'replayDrawpile',
  {
    description:
      'The next #{stacks} cards played will be placed on top of the draw pile.',
    name: 'Replay',
    innerColor: '#dd7712',
    outerColor: '#dd7712',
    sides: 13,
  },
  {
    stacked: true,
    delta: (x) => 0,
    on: EndTurn,
    min: 1,
    max: 99,
  },
  (owner) => ({
    type: AddToDiscardPile,
    actors: [owner],
    tags: [PlayCard],
  }),
  (owner, type) =>
    function*({ data, resolver, cancel, actors, subject }) {
      const loss = new BindEffect(actors, owner, {
        Effect: ReplayEffectDP,
        stacks: -1,
      })

      const place = new AddToDrawPile(actors, subject, {})

      yield resolver.processEvent(loss)
      yield resolver.processEvent(place)

      return cancel()
    },
  [ExhaustCard, ReplayEffectH],
  [AddToDiscardPile]
)
