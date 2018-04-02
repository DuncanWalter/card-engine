import { state } from "./battle/battleState";
import { Col, Row } from "../utility"
import { Switch, Route } from "react-router-dom"

import { Battle } from "./battle/battle"
import { PathSelection } from "../paths/pathSelection"

export const Game = ({ match }: *) => <Col>
    <div>
        <Row backgroundColor='#474441'>
            <p><b>SL4M The Adventurer</b></p>
            <div style={{ flex: 1 }}/>
            <p>{state.deck.size} cards</p>
            <p>Settings and Crap</p>
        </Row>
    </div>
    <div style={{ flex: 1, position: 'relative' }}>
        <Switch>
            <Route path={`${match.path}/pathSelection`} render={() => <PathSelection paths={[
                { text: 'don\'t trust that way' },
                { text: 'choose that way dude' },
                { text: 'choose this way dude' },
            ]}/>}/>
            <Route path={`${match.path}/battle`} component={Battle}/>
        </Switch>
    </div>
</Col>