import type { Component } from "../component"
import type { State } from '../state'

import { Link } from 'react-router-dom'
import { Modal, Row, Button, Col, Block, Shim } from '../utility'
import { Route } from 'react-router-dom'
import { StartGame } from '../events/startGame'
import { SetupCombat } from '../events/setupCombat'
import { StartCombat } from '../events/startCombat'
import { Turtle } from '../creatures/turtle/turtle'
import { Cobra } from '../creatures/cobra/cobra'
import { resolver } from '../events/eventResolver'
import { withState, dispatch } from '../state'
import { selectFreedom, generateFreedoms } from './pathState';
import { Monster } from '../creatures/monster';
import { Entity } from '../components/entity';

type Props = { state: State }
export const PathSelection: Component<any> = withState(({ state }: Props) => {
    return <Modal>
        <h1>Select Path</h1>
        <Row>
            <Shim/>
            { state.path.freedoms.map(path => 
                <Route render={({ history }) => 
                    <Button onClick={ click => {
                        selectFreedom(dispatch, path)
                        generateFreedoms(dispatch)
                        history.push('/game/battle')
                        // TODO: Remove new Entity hacj
                        resolver.enqueueEvents(new SetupCombat(new Entity({}), new Entity({}), {
                            enemies: path.enemies.map(enemy => new Monster(enemy)),
                            seed: path.seed.fork(),
                        }))
                        resolver.enqueueEvents(new StartCombat(new Entity({}), new Entity({}), {}))
                    }}>
                        <Col style={{ width: '500px', height: '700px' }}>
                            <h1>{path.challengeRating - state.path.level - 10}</h1>
                            { path.rewards.map(p => <Block><p>{p.description}</p></Block>) }
                        </Col>
                    </Button>
                }/>
            ) }
            <Shim/>
        </Row>
    </Modal>
})