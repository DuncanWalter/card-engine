import { Hand } from '../hand/hand'
import { renderCreature as Creature } from '../../creatures/renderCreature'
import { EndTurn } from '../../events/turnActions'
import { Card } from '../../cards/card'
import { resolver } from '../../events/eventResolver'
import { Button, Row, Col, Block, Frame, Shim } from '../../utility'
import { stream, withState, dispatch } from '../../state';
import { withAnimation, overStream } from '../../components/withAnimation';
import { submitTarget, setFocus, unsetFocus } from '../combatState';
import { Player } from '../../creatures/player';

export const Battle = withState(({ state }) => {

    let game = resolver.state.getGame()
    
    return <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'stretch' }}>        

        <div style={{ flex: 3, display: 'flex', flexDirection: 'row' }}>
            <div style={{flex: 1}}/>

            {[game.player, ...game.allies, ...game.enemies].map(c => [
                <div 
                    onClick={ click => dispatch(submitTarget('monster', c.id)) }
                    onMouseEnter={ event => dispatch(setFocus(c)) }
                    onMouseLeave={ event => dispatch(unsetFocus(c)) }
                >
                    <Creature creature={c} game/>
                </div>,
                <Shim/>,
            ]).reduce((a, l) => a.concat(l), [])}

        </div>

        <Row shim>
            <div class='col' style={{ flex: 2, textAlign: 'center' }}>
                <div>Energy: {game.player.energy}</div>
                <div>Draw Pile: {game.drawPile.size}</div>
                <div>Hand Size: {game.hand.size}/10</div>
            </div>
            <div style={{ flex: 6 }}/>
            <div class='col' style={{ flex: 2, textAlign: 'center' }}>
                <div>Exhausted: {game.exhaustPile.size}</div>
                <div>Discard Pile: {game.discardPile.size}</div>
                <Button onClick={() => tryEndTurn(game)} style={sty.button}>End Turn</Button>
            </div>
        </Row>

        <div style={{ height: 0, display: 'flex', flexDirection: 'row' }}>
            <Shim/>            
            <Hand/>
            <Shim/>        
        </div>
    </div>
})

const sty = {
    button: {
        width: '320px',
        height: '67px',
        fontSize: '2rem',
        backgroundColor: '#444444',
    }
}

function tryEndTurn(game){
    const player = game.player
    if(player.inner.isActive){
        player.inner.isActive = false
        resolver.enqueueEvents(new EndTurn(player, player, {}))
    }
}










