import { Col, Row } from "../utility"
import { Switch, Route } from "react-router-dom"

import { Battle } from "./battle/battle"
import { Rewards } from "../paths/rewards"
import { PathSelection } from "../paths/pathSelection"
import { Path } from '../paths/path'
import { combineSlices } from "../utils/state"

import { battleSlice } from './battle/battleState' 
import { CardDraft } from "./cardDraft";


export const Game = ({ match }: *) => <Col>
    <div>
        <Row backgroundColor='#474441'>
            <p><b>SL4M The Adventurer</b></p>
            <div style={{ flex: 1 }}/>
            <p>{battleSlice.state.deck.size} cards</p>
            <p>Settings and Crap</p>
        </Row>
    </div>
    <div style={{ flex: 1, position: 'relative' }}>
        <Switch>
            <Route path={`${match.path}/pathSelection`} render={() => <PathSelection paths={[
                new Path(),
                new Path(),
                new Path(),
            ]}/>}/>
            <Route path={`${match.path}/battle`} component={ Battle }/>
            <Route path={`${match.path}/rewards`} component={ Rewards }/> 
            <Route path={`${match.path}/cardDraft`} component={ CardDraft }/>


        </Switch>
    </div>
</Col>

