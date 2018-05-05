import type { Component } from '../component'
import { Link, Route } from 'react-router-dom'
import { Button, Block, Frame, Modal, Col } from "../utility"
import { resolver } from '../actions/actionResolver'
import { StartGame } from '../actions/startGame'
import { reset } from './menuState';
import { dispatch } from '../state';

export const Main: Component<> = props => <Modal>
    <Col style={{ width: '1200px', height: '800px' }}>
        <Block><h1>Deck Dawdle</h1></Block>
        <Route render={({ history }) => 
            <Button onClick={click => {
                reset(dispatch)
                history.push('/menu/createGame')
            }}>Begin</Button>
        }/>
    </Col>
</Modal>