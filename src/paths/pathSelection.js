import type { Component } from "../component"
import { Link } from 'react-router-dom'
import { Modal, Row, Button, Col } from '../utility'
import { Route } from 'react-router-dom'
import { state as battle } from '../game/battle/battleState'
import { StartGame } from '../actions/startGame'
import { SetupCombat } from '../actions/setupCombat'
import { StartCombat } from '../actions/startCombat'
import { Turtle } from '../creatures/turtle/turtle'
import { Cobra } from '../creatures/cobra/cobra'
import { resolver } from '../actions/actionResolver'

type Props = {
    paths: {
        text: string
    }[]
}

export const PathSelection: Component<any> = ({ paths }: Props) => {
    return <Modal>
        <Row>{
            paths.map(path => 
                <Route render={({ history }) => 
                    <Button onClick={ click => {
                        history.push('/game/battle')
                        resolver.enqueueActions(new SetupCombat({}, {}, path.enemies))
                        resolver.enqueueActions(new StartCombat({}, {}, {}))
                    }}>
                        <Col width='500px' height='700px'>
                            <h1>{ path.text }</h1>
                            <p>transform a card</p>
                            <p>gain 5 hp</p>
                        </Col>
                    </Button>
                }/>
            )
        }</Row>
    </Modal>
}