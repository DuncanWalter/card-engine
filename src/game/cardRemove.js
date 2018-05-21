import type { Card } from '../cards/card'
import type { State } from '../state'
import { Modal, Row, Col, Block, Frame, Button } from '../utility'
import { Route } from 'react-router-dom'
import { resolver } from '../events/eventResolver'
import { Card as CardComponent } from '../cards/component'
import { navigateTo } from '../utils/navigation'
import { CardLibrary } from '../cards/cardLibrary'
import { dispatch, withState } from '../state'
import { RemoveCard } from '../events/removeCard';
import { collectReward, deactivateReward } from '../paths/pathState';
import { Card as CardObject } from '../cards/card';
import { Player } from '../creatures/player';
import { CardPanel } from './cardPanel';

type Props = { state: State }

export const CardRemove = withState(({ state }: Props) => {

    let reward = state.path.rewards.filter(reward => reward.active)[0]
    let game = resolver.state.getGame()

    return <Modal>
        <h1>Remove Card</h1>
        
        <CardPanel cards={[...game.deck]} sets={game.player.sets} onClick={ card => {
            collectReward(dispatch, reward)
            deactivateReward(dispatch, reward)
            resolver.processEvent(new RemoveCard(new Player(state.battle.player), card, {}))
            navigateTo('/game/rewards')
        }}/>

        <Button onClick={() => {
            navigateTo(`/game/rewards`)
        }}>Skip</Button>
    </Modal>

})