import { registerOverlay } from '../game/overlay'
import { CardFan } from '../game/cardFan'
import { Button, Col } from '../utility'
import { CardPanel } from '../game/cardPanel'
import { ImproveCard } from '../events/improveCard'
import { registerReward } from './reward'
import { dispatch } from '../state'
import React from 'react'

const selectUpgrade = registerOverlay(({ resolve, game, card }) => {
  return (
    <Col shim>
      <h1>Select Upgrade</h1>
      <p>Select an upgrade.</p>
      <CardFan
        sets={game.player.sets}
        cards={card.upgrades(game.player.sets)}
        onClick={(card) => {
          resolve(card)
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
  )
})

const improveCard = registerOverlay(({ resolve, game }) => {
  return (
    <Col shim>
      <h1>Improve Card</h1>
      <p>Select a card from your deck to improve.</p>
      <CardPanel
        cards={[...game.deck].filter(
          (card) => card.upgrades(game.player.sets).length
        )}
        sets={game.player.sets}
        onClick={(card) => {
          selectUpgrade({ resolve, game, card }).then((upgrade) => {
            if (upgrade) {
              resolve(
                new ImproveCard(game.player, card, {
                  from: game.deck,
                  upgrade,
                })
              )
            }
          })
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
  )
})

registerReward('Improve', 'Improve a Card', 3, function* improve(
  self,
  resolver,
  game
) {
  const improvement = yield improveCard({ game })
  if (improvement) {
    self.collected = true
    resolver.processEvent(improvement)
  }
})
