import type { State } from '../state'
import { withState } from "../state";
import { Row } from "../utility";
import { Card } from "../cards/component";
import { Card as CardO } from "../cards/card"

type CardPanelProps = { 
    state: State, 
    cards: CardO<>[], 
    sets: string[], 
    onClick?: (card: Card) => void,
}

export const CardPanel = withState(({ state, cards, sets, onClick }: CardPanelProps) => <div style={{
    overflowY: 'scroll',
    position: 'relative', 
    flex: 1,
}}>
    <Row shim style={{ 
        flexWrap: 'wrap',
        padding: '15px',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    }}>
        {cards.map(card => 
            <div style={{ flex: '0 0 18%', padding: '15px' }} onClick={ click => onClick? onClick(card): null }>
                <Card card={ card } sets={ sets } glow={ false }/>
            </div>
        )}
        <div style={{ flex: '0 0 95%', height: '32vh' }}/>
    </Row>
</div>)