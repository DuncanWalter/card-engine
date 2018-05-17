import type { State } from '../state'
import { withState } from "../state";
import { Row, Block } from "../utility";
import { Card } from "../cards/component";
import { Card as CardO } from "../cards/card"
import styled from "styled-components";

const Wrapper = styled.div`
    overflow-y: scroll;
    position: relative;
    flex: 1;
    margin: 4px;
    border: solid #44444f 2px;
    background: rgba(0, 0, 0, 0.18);
    border-radius: 12px;
`

const Panel = Row.extend`
    justify-content: center;
    flex-wrap: wrap;
    padding: 15px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`

type CardPanelProps = { 
    state: State, 
    cards: CardO<>[], 
    sets: string[], 
    onClick?: (card: Card) => void,
}

const CardPanelInner = ({ state, cards, sets, onClick }: CardPanelProps) => <Wrapper>
    <Panel>
        {cards.map(card => 
            <div style={{ margin: '15px' }} onClick={ click => onClick? onClick(card): null }>
                <Card card={ card } sets={ sets } glow={ false }/>
            </div>
        )}
        <div style={{ flex: '0 0 90%', height: '32vh' }}/>
    </Panel>
</Wrapper>

export const CardPanel = withState(CardPanelInner)










