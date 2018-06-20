import { registerOverlay } from '../game/overlay'
import { Col, Button } from '../utility'
import { RemoveCard } from '../events/removeCard'
import { registerReward } from './reward'
import { dispatch } from '../state'
import { CardLibrary } from '../cards/cardLibrary'
import { DraftCard } from '../events/draftCard'
import { adventurer } from '../cards/adventurer/adventurer'
import { CardFan } from '../game/cardFan'
import React from 'react'

const draftCard = registerOverlay(({ resolve, game, cards }) => (
  <Col shim>
    <h1>Draft Card</h1>
    <CardFan
      cards={cards}
      sets={game.player.sets}
      onClick={(card) => {
        resolve(new DraftCard(game.player, card, {}))
      }}
    />
    <Button
      onClick={() => {
        resolve(undefined)
      }}
    >
      Back
    </Button>
  </Col>
))

registerReward(
  'Draft',
  'Draft a Card.',
  2,
  function*(self, resolver, game): * {
    const draft = yield draftCard({ game, cards: self.cards })
    if (draft) {
      self.collected = true
      resolver.processEvent(draft)
    }
  },
  (self, game, seed) => {
    let cards = CardLibrary.sample(
      3,
      game.player.sets.reduce(
        (acc, name) => {
          // $FlowFixMe
          acc[name] = 1
          return acc
        },
        {
          // $FlowFixMe
          [adventurer.name]: 0.35,
        }
      ),
      {
        D: 1.0,
        C: 0.7,
        B: 0.4,
        A: 0.1,
      },
      seed
    ).map((CC) => new CC())
    self.cards = cards
    return self
  }
)
