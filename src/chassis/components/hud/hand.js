import { Card } from './card'
import { Card as CardObject } from './../../../engine/cards/card'
import { GameState } from './../../../engine/gameState'
import { withSlice } from '../hocs/withSlice'
import { view } from 'vitrarius'
import { createSlice } from '../../../core/state' 


export const handSlice = createSlice('hand', {
    setFocus: (state, data) => view('focus', () => data, state),
    setCursor: (state, data) => console.log(data) || state,
}, {
    cursor: {
        x: -1,
        y: -1,
    },
    focus: null,
})

type Props = {
    game: $ReadOnly<GameState>,
    state: any, // TODO:
}

// should the card 'dtos' have a render, or should the hand map
// dto to component? Probably the latter... TODO:
export const Hand = withSlice(handSlice, 'state')(({ game, state }: Props) => {
    return <div 
        style={sty.hand}
        onMouseMove={e => state.dispatcher.setCursor(e)}
    >
        <div style={{ flex: 1 }}/>
        <div style={{ width: 0 }}>
            {game.hand.map((e, i, l) => <div style={
                sty.nthCardPoint(i, l.length, e == state.focus)
            }><div style={sty.slot}><Card card={e} game={game} hand={state}/></div></div>)}
        </div>
        <div style={{ flex: 1 }}/>
    </div>;
});

const sty = {
    nthCardPoint: (n, m, isFocus) => {

        let parab = x => x**2;
        let index = (n-(m-1)/2);
        let offset = index/m*2;

        let angle = 10 * ((Math.abs(offset) + 0.45) ** 2);
        if(offset == 0){
            angle = 0;
        }
        angle = 0.3*180/3.1415*Math.atan(offset);

        return { 
            transform: `translate(${215*index}px, ${(isFocus ? -200 : -110) + 140*parab(offset)}px) rotate(${ angle }deg)`,
            // transform: `translate(${164*(n-(m-1)/2)}px)`,
            width: 0,
            height: 0,
            flex: 1,
            position: 'relative',
            zIndex: isFocus ? 10 : 'auto'
        }
    },
    slot: {
        position: 'absolute',
        left: '-164px',
        // top: '-249px',
    }, 
    hand: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        flex: 7,
        // width: 0,
    },
};