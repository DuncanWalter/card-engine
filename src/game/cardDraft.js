import type { Component } from "../component"
import type { Card } from '../cards/card';
import { Modal, Row, Col, Block, Button } from '../utility'
import { Route } from 'react-router-dom'
import { resolver } from '../events/eventResolver'
import { Card as CardComponent } from '../cards/component';
import { queryEntity } from '../components/entityState';
import { DraftCard } from '../events/draftCard';
import { navigateTo } from '../utils/navigation';
import { CardLibrary } from '../cards/cardLibrary';
import { dispatch, withState } from '../state';
import { collectReward, deactivateReward } from '../paths/pathState';

type Props = { state: * }

export const CardDraft: Component<Props> = withState(({ state }: Props) => {

    let reward = state.path.rewards.filter(reward => reward.active)[0]
    let cards = reward.cards

    return <Modal>
        <h1>Draft Card</h1>
        <Row>{
            cards.map(card => 
                <Button onClick={ click => {
                    collectReward(dispatch, reward)
                    deactivateReward(dispatch, reward)
                    resolver.processEvent(new DraftCard(resolver.state.getGame().player, card.clone(), {})).then(() => {
                        navigateTo('/game/rewards')
                    })
                }}>
                    <CardComponent card={ card }/>
                </Button>
            )
        }</Row>
        <Button onClick={() => {
            deactivateReward(dispatch, reward)
            navigateTo(`/game/rewards`)
        }}>Skip</Button>
    </Modal>
})