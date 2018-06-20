import { Hand } from '../hand/hand'
import { renderCreature as Creature } from '../../creatures/renderCreature'
import { EndTurn } from '../../events/turnActions'
import { Card } from '../../cards/card'
import { resolver } from '../../events/eventResolver'
import { Button, Row, Col, Block, Frame, Shim } from '../../utility'
import { stream, withState, dispatch } from '../../state'
import { withAnimation, overStream } from '../../components/withAnimation'
import { submitTarget, setFocus, unsetFocus } from '../combatState'
import { Player } from '../../creatures/player'
import { queryHand } from '../../cards/utils'
import { PlayCard } from '../../events/playCard'
import { Game, withGame } from './battleState'
import { lifecycle } from 'recompose'
import React from 'react'

const playLoop = withGame(({ game }) => {
  console.log('looping?')
  queryHand(game, true).then((card) => {
    console.log(card)
    if (!resolver.processing && card) {
      resolver.enqueueEvents(
        new PlayCard(game.player, card, {
          from: game.hand,
        })
      )
    }
    playLoop({})
  })
})
playLoop({})

export const Battle = withGame(
  withState(({ state, game }) => {
    return (
      <Col shim>
        <Row style={{ flex: 3 }}>
          <Shim />
          {[...game.allies, game.player].map((c) => (
            <div
              onClick={(click) => dispatch(submitTarget(c.id))}
              onMouseEnter={(event) => dispatch(setFocus(c))}
              onMouseLeave={(event) => dispatch(unsetFocus(c))}
            >
              <Creature creature={c} game />
            </div>
          ))}
          <Shim />
          {[...game.enemies].map((c) => (
            <div
              onClick={(click) => dispatch(submitTarget(c.id))}
              onMouseEnter={(event) => dispatch(setFocus(c))}
              onMouseLeave={(event) => dispatch(unsetFocus(c))}
            >
              <Creature creature={c} game />
            </div>
          ))}
          <Shim />
        </Row>

        <Row shim>
          <Col shim style={{ textAlign: 'center' }}>
            <div>Energy: {game.player.energy}</div>
            <div>Draw Pile: {game.drawPile.size}</div>
            <div>Hand Size: {game.hand.size}/10</div>
          </Col>
          <div style={{ flex: 3 }} />
          <Col shim style={{ textAlign: 'center' }}>
            <div>Exhausted: {game.exhaustPile.size}</div>
            <div>Discard Pile: {game.discardPile.size}</div>
            <Button onClick={() => tryEndTurn(game)} style={sty.button}>
              End Turn
            </Button>
          </Col>
        </Row>

        <Row style={{ height: 0 }}>
          <Shim />
          <Hand />
          <Shim />
        </Row>
      </Col>
    )
  })
)

const sty = {
  button: {
    width: '320px',
    height: '67px',
    fontSize: '2rem',
    backgroundColor: '#444444',
  },
}

function tryEndTurn(game) {
  const player = game.player
  if (player.inner.isActive) {
    player.inner.isActive = false
    resolver.enqueueEvents(new EndTurn(player, player, {}))
  }
}
