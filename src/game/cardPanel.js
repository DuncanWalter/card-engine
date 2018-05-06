import { withState } from "../state";
import { Row } from "../utility";
import { Card } from "../cards/component";

export const CardPanel = withState(({ state, cards }) => <div style={{
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
            <div style={{ flex: '0 0 18%', padding: '15px' }}>
                <Card card={ card } glow={ true }/>
            </div>
        )}
        <div style={{ flex: '0 0 95%', height: '32vh' }}/>
    </Row>
</div>)