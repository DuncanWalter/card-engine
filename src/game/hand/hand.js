import { Card } from '../../cards/component'
import { Card as CardObject } from './../../cards/card'
import { updateHand, setFocus, unsetFocus, CardSlot as CardSlotT } from './handState'
import { withAnimation } from '../../components/withAnimation'
import { CenterPoint } from '../../components/centerPoint'
import { Transform } from '../../components/transform'
import { dispatch, withState, stream } from '../../state'
import { resolver } from '../../events/eventResolver';
import { PlayCard } from '../../events/playCard';
import { Shim } from '../../utility';
import { submitTarget } from '../combatState';
import { Game, withGame } from '../battle/battleState';

const sty = {
    hand: {
        display: 'flex',
        flexDirection: 'row',
        height: 0,
        // TODO: align items end/bottom in this case
    },
}

type CardSlotProps = { slot: CardSlotT, game: Game }
const CardSlot = withGame(({ slot, game }: CardSlotProps) => {
    
    // TODO: snag the legitimate Card
    const isFocus = slot.isFocus
    const card = slot.card

    return <Transform 
        x={ slot.pos.x } 
        y={ isFocus? -220: slot.pos.y } 
        a={ isFocus? 0: slot.pos.a } 
        style={{ zIndex: isFocus ? 3 : 'auto' }}
    >
        <CenterPoint content={
            <div
                onClick={ click => dispatch(submitTarget(card)) }
                onMouseEnter={ click => dispatch(setFocus(card)) }
                onMouseLeave={ click => dispatch(unsetFocus(card)) }
            >
                <Card 
                    glow={ isFocus } 
                    card={ card } 
                    sets={ game.player.sets }
                    playEnergy={ game.player.energy }
                />
            </div>
        }/>
    </Transform>
})

export const Hand: Component<> = withState(withAnimation(({ state, delta }) => {
    dispatch(updateHand(/* TODO: delta */))
    return <div style={sty.hand}>
        <Shim/>        
        <div style={{ width: 0, height: 0 }}>{[
            ...state.hand.cardSlots.map(slot => 
                <CardSlot slot={slot}/>
            )
        ]}</div>
        <Shim/>
    </div>
}))

















