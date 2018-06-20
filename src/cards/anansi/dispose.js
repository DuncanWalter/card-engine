import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../events/damage'
import { upgrade, queryHand } from '../utils'
import { ExhaustCard } from '../../events/exhaustCard'

type DisposeData = BasicCardData & { block: number }

export const Dispose: () => Card<DisposeData> = defineCard(
  'Dispose',
  playDispose,
  {
    block: 6,
    energy: 1,
    playable: true,
  },
  {
    color: '#223399',
    title: 'Dispose',
    text: 'Gain #{block} block. #[Destroy] a card.',
  }
)

function* playDispose(
  self: Card<DisposeData>,
  { actors, game, resolver, energy }: PlayArgs
) {
  const target: Card<> | void = yield queryHand(game)

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
  yield resolver.processEvent(action)

  if (target) {
    const destroy = new ExhaustCard(actors, target, { from: game.hand })
    yield resolver.processEvent(destroy)
  }

  return {
    block: action.data.stacks,
    playable: true,
    energy,
  }
}

// export const DisposeL = upgrade('L', Dispose, { energy: 0 })
export const DisposeR = upgrade('R', Dispose, { block: 9 })
