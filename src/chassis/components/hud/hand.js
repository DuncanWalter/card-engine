import type { GameState } from './../../../engine/gameState'

import { Card } from './card'
import { Card as CardObject } from './../../../engine/cards/card'
import { withSlice } from '../hocs/withSlice'
import { createSlice } from '../../../core/state' 
import { handSlice } from './handSlice'
import { view } from '../../view';
import { gameSlice } from '../../../engine/gameState';

type Props = {
    game: $ReadOnly<GameState>,
    view: any, // TODO: 
    playCard: (card: CardObject<any>, target: mixed) => void,
}

// should the card 'dtos' have a render, or should the hand map
// dto to component? Probably the latter... TODO:
export const Hand = withSlice(view, 'view')(({ game, view }: Props) => {
    return <div 
        style={sty.hand}
    >
        <div style={{ flex: 1 }}/>
        <div style={{ width: 0 }}>
            {game.hand.concat(game.activeCards).map((e, i, l) => <div style={
                sty.nthCardPoint(i, l.length, e)
            }><div><Card card={e} game={game} hand={view}/></div></div>)}
        </div>
        <div style={{ flex: 1 }}/>
    </div>
});








const sty = {
    nthCardPoint: (n, m, e) => {
        let isFocus = e == view.cursorFocus || gameSlice.activeCards.indexOf(e) >= 0

        let parab = x => x**2;
        let index = (n-(m-1)/2);
        let offset = index/m*2;

        let angle = 10 * ((Math.abs(offset) + 0.45) ** 2);
        if(offset == 0){
            angle = 0;
        }
        angle = 0.3*180/3.1415*Math.atan(offset);

        return { 
            transform: `translate(${215*index}px, ${(isFocus ? 10 : 190) + 140*parab(offset)}px) rotate(${ angle }deg)`,
            width: 0,
            height: 0,
            flex: 1,
            position: 'relative',
            zIndex: isFocus ? 10 : 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '-500px',
        }
    },
    hand: {
        display: 'inline',
        flexDirection: 'row',
        height: '100%',
        width: 0,
    },
}
