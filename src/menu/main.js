import type { Component } from '../component'
import { Link, Route } from 'react-router-dom'
import { Button, Block, Frame, Modal, Col, Shim } from "../utility"
import { resolver } from '../events/eventResolver'
import { StartGame } from '../events/startGame'
import { reset } from './menuState';
import { dispatch } from '../state';
import styled from 'styled-components';

export const Main: Component<> = props => <Col shim>
    <Shim/>
    <Block fill><h1>Deck Dawdle</h1></Block>
    <Route render={({ history }) => 
        <Button onClick={click => {
            reset(dispatch)
            history.push('/menu/createGame')
        }}>Begin</Button>
    }/>
    <Shim/>
</Col>
