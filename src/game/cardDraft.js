import type { Card } from '../cards/card';
import { Modal, Row, Col, Block, Button } from '../utility'
import { Route } from 'react-router-dom'
import { resolver } from '../events/eventResolver'
import { Card as CardComponent } from '../cards/component';
import { DraftCard } from '../events/draftCard';
import { navigateTo } from '../utils/navigation';
import { CardLibrary } from '../cards/cardLibrary';
import { dispatch, withState, type State } from '../state';
import { collectReward, deactivateReward } from '../paths/pathState';
import { CardFan } from './cardFan';

type Props = { state: State }

export const CardDraft = withState(({ state }: Props) => {

    let reward = state.path.rewards.filter(reward => reward.active)[0]
    let cards = reward.cards

    let game = resolver.state.getGame()

    return <Modal>
        <h1>Draft Card</h1>
        <CardFan cards={cards} sets={game.player.sets} onClick={ card => {
            collectReward(dispatch, reward)
            deactivateReward(dispatch, reward)
            resolver.processEvent(new DraftCard(resolver.state.getGame().player, card.clone(), {})).then(() => {
                navigateTo('/game/rewards')
            })
        }}/>
        <Button onClick={() => {
            deactivateReward(dispatch, reward)
            navigateTo(`/game/rewards`)
        }}>Skip</Button>
    </Modal>
})