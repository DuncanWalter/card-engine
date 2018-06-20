import { BasicCardData, defineCard, PlayArgs, Card } from '../card'
import { queryHand } from '../utils'
import { AddToHand } from '../../events/addToHand'

type DuplicateData = BasicCardData & { copies: number }

export const Duplicate = defineCard(
  'Duplicate',
  playDuplicate,
  {
    energy: 1,
    copies: 1,
  },
  {
    color: '#3355aa',
    text: 'Create #{copies} copies of a card in your hand.',
    title: 'Duplicate',
  }
)

function* playDuplicate(
  self: Card<DuplicateData>,
  { game, energy, actors, resolver }: PlayArgs
) {
  const target: Card<> | void = yield queryHand(game)
  let ii = self.data.copies

  while (ii-- && target) {
    const duplicate = new AddToHand(actors, target.clone(), {})
    yield resolver.processEvent(duplicate)
  }

  return { ...self.data, energy, copies: self.data.copies }
}
