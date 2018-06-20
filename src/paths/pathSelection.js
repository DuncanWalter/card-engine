import type { State } from '../state'
import { Link, Route } from 'react-router-dom'
import { Modal, Row, Button, Col, Block, Shim } from '../utility'
import { StartGame } from '../events/startGame'
import { SetupCombat } from '../events/setupCombat'
import { StartCombat } from '../events/startCombat'
import { Turtle } from '../creatures/turtle/turtle'
import { Cobra } from '../creatures/cobra/cobra'
import { resolver } from '../events/eventResolver'
import { withState, dispatch } from '../state'
import { Path } from './path'
import { Monster } from '../creatures/monster'
import { Entity } from '../utils/entity'
import { Player } from '../creatures/player'
import { Game, withGame } from '../game/battle/battleState'
import React from 'react'

type Props = { game: Game }
export const PathSelection = withGame(({ game }: Props) => {
  if (game.path.children) {
    const children = game.path.children
    return (
      <Modal>
        <h1>Select Path</h1>
        <Row>
          <Shim />
          {game.path.children.map((path) => (
            <Route
              render={({ history }) => (
                <Button
                  onClick={(click) => {
                    game.path = path
                    history.push('/game/battle')
                    let player = game.player
                    resolver.enqueueEvents(
                      new SetupCombat(player, player, {
                        enemies: path.enemies,
                        seed: path.seed.fork(),
                      })
                    )
                    resolver.enqueueEvents(new StartCombat(player, player, {}))
                  }}
                >
                  <Col style={{ width: '500px', height: '700px' }}>
                    <h1>{path.challengeRating - game.path.level - 10}</h1>
                    {path.rewards.map((p) => (
                      <Block>
                        <p>{p.description}</p>
                      </Block>
                    ))}
                  </Col>
                </Button>
              )}
            />
          ))}
          <Shim />
        </Row>
      </Modal>
    )
  } else {
    game.path.generateChildren(game)
    return <PathSelection />
  }
})
