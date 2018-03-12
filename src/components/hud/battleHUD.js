import type { Component } from '../component'
import { Hand } from '../hand/hand'
import { gameSlice, GameState } from '../../gameState'
import { overStream } from '../utility/overStream'
import { Creature } from './creature'
import { EndTurn } from '../../actions/turnActions'
import { Card } from '../card/card'
import { Slice } from '../../utils/state'
import { view as viewSlice } from '../../view'

const unit = <div style={{ flex: 1 }}/>

const game = gameSlice.state
const view = viewSlice.state

export const BattleHUD: Component<{}> = overStream(gameSlice.stream, 'game')(props => {
    
    let endTurn = () => game.resolver.enqueueActions(new EndTurn({}, game.player, {}))

    return <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'stretch' }}>
        {/* relic bar! */}
        {/* combat pane! */}
        <div style={{ flex: 3, display: 'flex', flexDirection: 'row' }}>
            <div style={{flex: 1}}/>

            {[game.player, ...game.allies, ...game.enemies].map(c => [
                <Creature creature={c} game/>,
                <div style={{flex: 1}}/>,
            ]).reduce((a, l) => a.concat(l), [])}

        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
            <div class='col' style={{ flex: 2, textAlign: 'left' }}>
                <div>{game.player.energy}/{game.player.maxEnergy}</div>
                <div>{game.drawPile.length}</div>
            </div>
            <div style={{ flex: 6 }}/>
            <div class='col' style={{ flex: 2, textAlign: 'right' }}>
                <div>exhausted</div>
                <div>{game.discardPile.length}</div>
                <button onClick={() => endTurn()} style={sty.button}>End Turn</button>
            </div>
        </div>
        <div style={{ height: 0, display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1 }}/>
            <Hand game={game}/>
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