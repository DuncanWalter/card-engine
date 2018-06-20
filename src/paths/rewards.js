import type { Reward as RewardT } from './reward'
import { Modal, Block, Col, Button, Row, Shim } from '../utility'
import { withState, stream } from '../state'
import { history } from '../utils/navigation'
import { overStream } from '../components/withAnimation'
import { resolver } from '../events/eventResolver'
import { OverlayContext } from '../game/overlay'
import React from 'react'

import './improveCard'
import './removeCard'
import './draftCard'
import { withGame } from '../game/battle/battleState'
import { collect } from './reward'
// import './aquirePragma'
// import './heal'

type Props = { state: *, match: any }

export const Rewards = withGame(({ game, match }) => {
  return (
    <Modal>
      <OverlayContext match={match}>
        <Col shim>
          <h1>Combat Rewards</h1>
          <Row shim>
            <Shim />
            <Col shim>
              {game.path.rewards
                .filter((reward) => !reward.collected)
                .map((reward) => <Reward reward={reward} />)}
            </Col>
            <Shim />
          </Row>
          <Button onClick={() => history.push(`/game/pathSelection`)}>
            Continue
          </Button>
        </Col>
      </OverlayContext>
    </Modal>
  )
})

const Reward = withGame(({ reward, game }) => {
  return (
    <Button
      style={{ height: '60px' }}
      onClick={(e) => collect(reward, resolver, game)}
    >
      {/* TODO: would interpolation help me here? */}
      <p>{reward.description}</p>
    </Button>
  )
})
