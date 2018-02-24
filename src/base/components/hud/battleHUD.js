import { Hand } from './hand'

import { Strike } from './../../cards/strike'
import { Defend } from './../../cards/defend'
import { gameState } from '../../gameState'

const game: * = gameState.view();

export const BattleHUD = () => {

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* relic bar! */}
        {/* combat pane! */}
        <div style={{ flex: 3 }}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 2 }}>
                <div>3/3</div>
                <div>drawpile</div>
            </div>
            <Hand cards={game.hand} style={{ flex: 7 }}/>
            <div style={{ flex: 2 }}>
                <div>exhausted</div>
                <div>discard</div>
            </div>
        </div>
    </div>
}