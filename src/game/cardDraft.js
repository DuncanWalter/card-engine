import type { Component } from "../component"
import { Modal, Row, Col, Block } from '../utility'
import { Route } from 'react-router-dom'
import { state as battle } from '../game/battle/battleState'
import { resolver } from '../actions/actionResolver'
import { Card, renderCard as CardComponent } from '../cards/card';
import { queryEntity } from '../components/entity';
import { DraftCard } from '../actions/draftCard';
import { navigateTo } from '../utils/navigation';
import { CardLibrary } from '../cards/cardLibrary';

type Props = {
    cards: {
        card: Card<>
    }[]
}

export const CardDraft: Component<any> = ({  }: Props) => {

    let cards = CardLibrary.sample(3).map(cc => new cc())

    console.log(cards)

    new Promise(resolve => {
        queryEntity(any => cards.includes(any), resolve)        
    }).then(card => {
        resolver.processAction(new DraftCard({}, card, {}))
        navigateTo('/game/pathSelection')
    })

    return <Modal>
        <h1>Draft Card</h1>
        <Row>{
            cards.map(card => <Block>
                <CardComponent card={ card }/>
            </Block>)
        }</Row>
    </Modal>
}