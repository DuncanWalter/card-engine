import { Hand } from './hand'
import { gameState, GameState } from '../../../engine/gameState'
import { withSlice } from '../hocs/withSlice'
import { dispatch } from '../../../engine/gameState'
import { Creature } from './creature'
import { EndTurn } from '../../../engine/actions/endTurn'

import type { Component } from '../component';

const unit = <div style={{flex: 1}}/>

type Props = { game: GameState }
export const BattleHUD: Component<Props> = withSlice(gameState, 'game')(({ game }: Props) => {
    
    let endTurn = () => game.resolver.enqueueActions(new EndTurn({}, game.player, {}))


    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* relic bar! */}
        {/* combat pane! */}
        <div style={{ flex: 3, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{flex: 1}}/>
            <Creature creature={game.player} game={game}/>
            <div style={{flex: 1}}/>
            <Creature creature={game.enemies[0]} game={game}/>
            <div style={{flex: 1}}/>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 2, textAlign: 'left' }}>
                <div>{game.player.energy}/{game.player.maxEnergy}</div>
                <div>{game.drawPile.length}</div>
            </div>
            <Hand cards={game.hand} style={{ flex: 7 }}/>
            <div style={{ flex: 2, textAlign: 'right' }}>
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
        fontSize: '3rem',
    }
};