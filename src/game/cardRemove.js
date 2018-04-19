import type { Component } from "../component"
import type { Card } from '../cards/card'
import type { State } from '../state'
import { Modal, Row, Col, Block, Frame, Button } from '../utility'
import { Route } from 'react-router-dom'
import { resolver } from '../actions/actionResolver'
import { Card as CardComponent } from '../cards/component'
import { queryEntity } from '../components/entityState'
import { navigateTo } from '../utils/navigation'
import { CardLibrary } from '../cards/cardLibrary'
import { dispatch, withState } from '../state'
import { RemoveCard } from '../actions/removeCard';

type Props = { state: State }

export const CardRemove: Component<any> = withState(({ state }: Props) => {

    let cancel
    new Promise(resolve => {
        cancel = queryEntity(dispatch, card => state.battle.deck.has(card), resolve)        
    }).then(card => {
        resolver.processAction(new RemoveCard({}, card, {}))
        navigateTo('/game/rewards')
    })

    return <Modal>
        <h1>Remove Card</h1>
        <Row>{
            [...state.battle.deck].map(card => 
                <div style={'width: 20%, display: inline-block'}>
                    <Frame>
                        <CardComponent card={ card }/>
                    </Frame>
                </div>
            )
        }</Row>
        <Button onClick={() => {
            cancel()
            navigateTo(`/game/rewards`)
        }}>Skip</Button>
    </Modal>
})