import type { Component } from '../component'
import { Link, Route } from 'react-router-dom'
import { Button, Block, Frame, Modal, Col } from "../utility"
import { resolver } from '../actions/actionResolver'
import { StartGame } from '../actions/startGame'

export const Main: Component<> = props => <Modal>
    <Frame>
        <Col width='1200px' height='800px'>
            <Block><h1>Deck Dawdle</h1></Block>
            <Route render={({ history }) => 
                <Button onClick={click => {
                    resolver.processAction(new StartGame({}, {}, {}))
                    history.push('/game/pathSelection')
                }}>Begin</Button>
            }/>
            <Link to='game/pathSelect'><Button>These Links</Button></Link>
            <Link to='game/pathSelect'><Button>Are All</Button></Link>
            <Link to='game/pathSelect'><Button>Lies</Button></Link>
        </Col>
    </Frame>
</Modal>