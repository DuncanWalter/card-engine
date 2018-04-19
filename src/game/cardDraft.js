import type { Component } from "../component"
import type { Card } from '../cards/card';
import { Modal, Row, Col, Block, Button } from '../utility'
import { Route } from 'react-router-dom'
import { resolver } from '../actions/actionResolver'
import { Card as CardComponent } from '../cards/component';
import { queryEntity } from '../components/entityState';
import { DraftCard } from '../actions/draftCard';
import { navigateTo } from '../utils/navigation';
import { CardLibrary } from '../cards/cardLibrary';
import { dispatch, withState } from '../state';

type Props = { state: * }

export const CardDraft: Component<Props> = withState(({ state }: Props) => {

    let reward = state.path.rewards.filter(reward => reward.active)[0]

    let cards = reward.cards

    let cancel
    new Promise(resolve => {
        cancel = queryEntity(dispatch, any => cards.includes(any), resolve)        
    }).then(card => {
        reward.collected = true // TODO: dispatch this crap
        resolver.processAction(new DraftCard({}, card, {}))
        navigateTo('/game/rewards')
    })

    return <Modal>
        <h1>Draft Card</h1>
        <Row>{
            cards.map(card => <Block>
                <CardComponent card={ card }/>
            </Block>)
        }</Row>
        <Button onClick={() => {
            cancel()
            navigateTo(`/game/rewards`)
        }}>Skip</Button>
    </Modal>
})