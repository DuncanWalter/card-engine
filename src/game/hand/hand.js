import { Card } from '../../cards/component'
import { Card as CardObject } from './../../cards/card'
import { update, handSlice } from './handState'

import { withAnimation } from '../../components/withAnimation'
import { CenterPoint } from '../../components/centerPoint'
import { Transform } from '../../components/transform'

let hand = handSlice.state

export const Hand = withAnimation('frameData')(props => {
    update()
    
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
