import { Card } from './card'
import { Card as CardObject } from './../../../engine/cards/card'
import { gameState } from './../../../engine/gameState'
import { withSlice } from '../hocs/withSlice';


// gameState.stream.map(s => s.hand).onValue(console.log);
type Props = {
    cards: Array<CardObject<any>>,
    state: any, // TODO:
}

// should the card 'dtos' have a render, or should the hand map
// dto to component? Probably the latter... TODO:
export const Hand = withSlice(gameState, 'game')(({ cards }: Props) => {
    return <div style={sty.hand}>
        <div style={{ flex: 1 }}/>
        <div style={{ width: 0 }}>
            {cards.map((e, i, l) => <div style={
                sty.nthCardPoint(i, l.length)
            }><div style={sty.slot}><Card card={e} game={gameState}/></div></div>)}
        </div>
        <div style={{ flex: 1 }}/>
    </div>;
});

// function stateful (component, initial, reducers, onMount, onUnMount){
//     let i = Symbol('unique');
//     let s: State<Symbol,>;
    
//     let c = withLifeCycle({
//         componentDidMount: el => (s = new State(i, reducers, initial)),
//         componentWillUnmount: () => s.destroy(),
//     })(component),

const sty = {
    nthCardPoint: (n, m) => {

        let parab = x => x**2;
        let index = (n-(m-1)/2);
        let offset = index/m*2;

        let angle = 10 * ((Math.abs(offset) + 0.45) ** 2);
        if(offset == 0){
            angle = 0;
        }
        angle = 0.3*180/3.1415*Math.atan(offset);

        return { 
            transform: `translate(${195*index}px, ${-240 + 140*parab(offset)}px) rotate(${ angle }deg)`,
            // transform: `translate(${164*(n-(m-1)/2)}px)`,
            width: 0,
            height: 0,
            flex: 1,
            position: 'relative',
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
        width: 0,
    },
};