import { Col, Row, Block, Material } from '../utility'
import { Switch, Route } from 'react-router-dom'
import { Battle } from './battle/battle'
import { Rewards } from '../paths/rewards'
import { PathSelection } from '../paths/pathSelection'
import { withGame } from '../game/battle/battleState'
import React from 'react'

export const Game = withGame(({ match, game }) => (
  <Col shim>
    <Material>
      <Row backgroundColor="#474441">
        <p>
          <b>SL4M The Adventurer</b> level: {game.path.level}
        </p>
        <div style={{ flex: 1 }} />
        <p>{game.deck.size} cards</p>
        <p>Settings and Crap</p>
      </Row>
    </Material>
    <Row>
      {[...game.pragmas].map((pragma) => (
        <Block style={{ width: '40px', height: '40px', borderRadius: '20px' }}>
          1
        </Block>
      ))}
    </Row>
    <Switch>
      <Route path={`${match.path}/pathSelection`} component={PathSelection} />
      <Route path={`${match.path}/battle`} component={Battle} />
      <Route path={`${match.path}/rewards`} component={Rewards} />
    </Switch>
  </Col>
))
