import { registerOverlay } from '../game/overlay'
import { Col, Button } from '../utility'
import { CardPanel } from '../game/cardPanel'
import { RemoveCard } from '../events/removeCard'
import { registerReward } from './reward'
import { dispatch } from '../state'
import React from 'react'

const removeCard = registerOverlay(({ resolve, game, resolver }) => (
  <Col shim>
    <h1>Remove Card</h1>
    <CardPanel
      cards={[...game.deck]}
      sets={game.player.sets}
      onClick={(card) => {
        resolve(new RemoveCard(game.player, card, {}))
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

registerReward('Remove', 'Remove a Card.', 4, function* remove(
  self,
  resolver,
  game
) {
  // TODO: should be a second yield technically...
  const removal = yield removeCard({ game })
  if (removal) {
    self.collected = true
    resolver.processEvent(removal)
  }
})
