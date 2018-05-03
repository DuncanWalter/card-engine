import type { Component } from '../component'
import { Link, Route } from 'react-router-dom'
import { Button, Block, Frame, Modal, Col } from "../utility"
import { resolver } from '../actions/actionResolver'
import { StartGame } from '../actions/startGame'
import styled from 'styled-components';

export const Main: Component<> = props => <Modal>
    <Frame>
        <Col style={{ width: '1200px', height: '800px' }}>
            <h1>New Game</h1>
            <h1>Character Selection</h1>
            <h2>Seeding</h2>

            <Route render={({ history }) => 
                <Button onClick={click => {
                    resolver.processAction(new StartGame({}, {}, {
                        seed: 100345,
                    }))
                    history.push('/game/pathSelection')
                }}>Begin</Button>
            }/>
        </Col>
    </Frame>
</Modal>