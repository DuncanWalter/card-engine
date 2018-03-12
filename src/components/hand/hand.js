import type { GameState } from './../../gameState'

import { Card } from '../card/card'
import { Card as CardObject } from './../../cards/card'
import { Slice } from '../../utils/state' 
import { handSlice } from './handState'
import { view } from '../../view'
import { gameSlice } from '../../gameState'

import { withAnimation } from '../utility/withAnimation'
import { CenterPoint } from '../utility/centerPoint'
import { Transform } from '../utility/transform'

const game = gameSlice.state
const hand = handSlice.state

export const Hand = withAnimation('frameData')(props => {

    handSlice.dispatcher.update()

    return <div style={sty.hand}>
        <div style={{ flex: 1 }}/>
        <div style={{ width: 0, height: 0 }}>{[
            ...hand.cardSlots.map(slot => <Transform position={ slot.pos } content={
                <CenterPoint content={
                    <Card card={ slot.card }/>
                }/>
            }/>),
            ...hand.cardSprites.map(sprite => <Transform position={ sprite.pos } content={
                <CenterPoint content={
                    <div style={{ backgroundColor: '#ffffff', minWidth: '100px', minHeight: '150px' }}/>
                }/>
            }/>),
        ]}</div>
        <div style={{ flex: 1 }}/>
    </div>
})

const sty = {
    hand: {
        display: 'flex',
        flexDirection: 'row',
        height: 0,
        // TODO: align items end/bottom in this case
    },
}
