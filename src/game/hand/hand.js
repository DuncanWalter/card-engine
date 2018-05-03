import type { Component } from '../../component'
import { Card } from '../../cards/component'
import { Card as CardObject } from './../../cards/card'
import { updateHand } from './handState'
import { withAnimation } from '../../components/withAnimation'
import { CenterPoint } from '../../components/centerPoint'
import { Transform } from '../../components/transform'
import { dispatch, withState, stream } from '../../state'

export const Hand: Component<*> = withState(withAnimation(({ state, delta, isNewAnimationFrame }: *) => {
    updateHand(dispatch)
    return <div style={sty.hand}>
        <div style={{ flex: 1 }}/>
        <div style={{ width: 0, height: 0 }}>{[
            ...state.hand.cardSlots.map(slot => {
                let isFocus = slot.card == state.entity.cursorFocus
                return <Transform 
                    x={ slot.pos.x } 
                    {/* TODO: move this relocation logic to the hand state */...{}}
                    y={ isFocus? -220: slot.pos.y } 
                    a={ isFocus? 0: slot.pos.a } 
                    style={{ zIndex: isFocus? 3: 'auto' }}
                >
                    <CenterPoint content={
                        <Card glow={ isFocus } card={ slot.card }/>
                    }/>
                </Transform>
            }),
            ...state.hand.cardSprites.map(sprite => <Transform { ...sprite.pos }>
                <CenterPoint content={
                    <div style={{ backgroundColor: '#ffffff', minWidth: '100px', minHeight: '150px' }}/>
                }/>
            </Transform>),
        ]}</div>
        <div style={{ flex: 1 }}/>
    </div>
}))

const sty = {
    hand: {
        display: 'flex',
        flexDirection: 'row',
        height: 0,
        // TODO: align items end/bottom in this case
    },
}
