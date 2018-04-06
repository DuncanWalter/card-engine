import type { Component } from '../../component'
import { Hand } from '../hand/hand'
import { overStream } from '../../components/overStream'
import { renderCreature as Creature } from '../../creatures/renderCreature'
import { EndTurn } from '../../actions/turnActions'
import { Card } from '../../cards/card'
import { resolver } from '../../actions/actionResolver'
import { Button, Row, Col, Block, Frame } from '../../utility'
import { battleSlice } from './battleState'

const unit = <div style={{ flex: 1 }}/>


let stream = battleSlice.stream
let game = battleSlice.state

export const Battle: Component<{}> = overStream(stream, 'game')(props => {

    return <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'stretch' }}>        

        <div style={{ flex: 3, display: 'flex', flexDirection: 'row' }}>
            <div style={{flex: 1}}/>

            {[game.player, ...game.allies, ...game.enemies].map(c => [
                <Creature creature={c} game/>,
                <div style={{flex: 1}}/>,
            ]).reduce((a, l) => a.concat(l), [])}

        </div>

        <Row>
            <div class='col' style={{ flex: 2, textAlign: 'center' }}>
                <div>Energy: {game.player.energy}/{game.player.maxEnergy}</div>
                <div>Draw Pile: {game.drawPile.size}</div>
            </div>
            <div style={{ flex: 6 }}/>
            <div class='col' style={{ flex: 2, textAlign: 'center' }}>
                <div>Exhausted: {game.exhaustPile.size}</div>
                <div>Discard Pile: {game.discardPile.size}</div>
                <Button onClick={() => tryEndTurn()} style={sty.button}>End Turn</Button>
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

function tryEndTurn(){
    if(game.player.isActive){
        game.player.isActive = false
        resolver.enqueueActions(new EndTurn({}, game.player, {}))
    }
}










