import type { Component } from '../../component'
import { Hand } from '../hand/hand'
import { renderCreature as Creature } from '../../creatures/renderCreature'
import { EndTurn } from '../../actions/turnActions'
import { Card } from '../../cards/card'
import { resolver } from '../../actions/actionResolver'
import { Button, Row, Col, Block, Frame } from '../../utility'
import { stream, withState } from '../../state';
import { withAnimation, overStream } from '../../components/withAnimation';

const unit = <div style={{ flex: 1 }}/>


export const Battle = withState(({ state }) => {

    let battle = state.battle
    
    return <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'stretch' }}>        


        <div style={{ flex: 3, display: 'flex', flexDirection: 'row' }}>
            <div style={{flex: 1}}/>

            {[battle.player, ...battle.allies, ...battle.enemies].map(c => [
                <Creature creature={c} battle/>,
                <div style={{flex: 1}}/>,
            ]).reduce((a, l) => a.concat(l), [])}

        </div>

        <Row shim>
            <div class='col' style={{ flex: 2, textAlign: 'center' }}>
                <div>Energy: {battle.player.energy}/{battle.player.maxEnergy}</div>
                <div>Draw Pile: {battle.drawPile.size}</div>
                <div>Hand Size: {battle.hand.size}/10</div>
            </div>
            <div style={{ flex: 6 }}/>
            <div class='col' style={{ flex: 2, textAlign: 'center' }}>
                <div>Exhausted: {battle.exhaustPile.size}</div>
                <div>Discard Pile: {battle.discardPile.size}</div>
                <Button onClick={() => tryEndTurn(battle)} style={sty.button}>End Turn</Button>
            </div>
        </Row>

        <div style={{ height: 0, display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1 }}/>
            <Hand/>
            <div style={{ flex: 1 }}/>
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

function tryEndTurn(battle){
    if(battle.player.isActive){
        battle.player.isActive = false
        resolver.enqueueActions(new EndTurn({}, battle.player, {}))
    }
}










