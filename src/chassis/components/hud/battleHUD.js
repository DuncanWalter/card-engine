import { Hand } from './hand'
import { gameSlice, GameState } from '../../../engine/gameState'
import { withSlice } from '../hocs/withSlice'
import { Creature } from './creature'
import { EndTurn } from '../../../engine/actions/turnActions'
import { Card } from './card'

import type { Component } from '../component';

const unit = <div style={{flex: 1}}/>

type Props = { game: GameState }
export const BattleHUD: Component<Props> = withSlice(gameSlice, 'game')(({ game }: Props) => {
    
    let endTurn = () => game.resolver.enqueueActions(new EndTurn({}, game.player, {}))

    return <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* relic bar! */}
        {/* combat pane! */}
        <div style={{ flex: 3, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
            <div style={{ flex: 3 }}/>
            <Hand game={game}/>
            <div style={{ flex: 3 }}/>
            <div class='col' style={{ flex: 2, textAlign: 'right' }}>
                <div>exhausted</div>
                <div>{game.discardPile.length}</div>
                <button onClick={() => endTurn()} style={sty.button}>End Turn</button>
            </div>
        </div>
    </div>
});

const sty = {
    button: {
        width: '320px',
        height: '67px',
        fontSize: '2rem',
        backgroundColor: '#444444',
    }
};