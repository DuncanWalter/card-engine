import { Card as CardObject } from "../../cards/card"
import { PlayCard } from "../../actions/playCard"
import { state as game } from "../battle/battleState"
import { Effect } from "../battle/effect"
import { state as view, dispatcher } from "../../viewState"

const a: any = Object.assign

type Props = {
    card: CardObject<any>,
}

export const Card = ({ card }: Props) => {

    // TODO: need to rework the energy part to check for price and playability 
    let { energy, color, text, title } = card.simulate({
        actor: game.player, // TODO: make this player and target
        subject: card,
        target: game.enemies[0], 
        resolver: game.resolver,
        data: card.data,
    })

    const clicked = e => {
        // use a dispatch and a display state TODO:
        game.resolver.enqueueActions(
            new PlayCard(
                game.player, 
                card,
                {
                    target: game.enemies[0],
                    success: false,
                }
            )
        )
    }

    return <div 
        style={sty.base(card == view.cursorFocus)} 
        onClick={clicked}
        onMouseEnter={e => dispatcher.setCursorFocus(card)}
        onMouseLeave={e => dispatcher.unsetCursorFocus(card)}
    >   
        <div style={sty.effectsBar}>
            {card.effects.map(e => <Effect effect={e}/>)}
        </div>
        <div style={sty.costBack}>{energy}</div>
        <div style={sty.title}>{title}</div>
        <div style={{ backgroundColor: color, ...sty.image }}></div>
        <div style={sty.text}>{text}</div>
    </div>
}


const sty = {
    base(isFocus){
        return {
            minWidth: '280px',
            minHeight: '440px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: isFocus? '#444444': '#222222',
            position: 'relative',
            borderRadius: '8px',
            padding: '4px',
            cursor: 'pointer',
            color: '#ffeedd',
        }
    },
    title: {
        flex: '1',
        backgroundColor: '#555555',
        borderRadius: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },
    image: {
        flex: '5',
        borderRadius: '8px',
        borderBottom: '4px solid #222222',
        borderTop: '4px solid #222222',
    },
    costBack: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '50px',
        height: '50px',
        backgroundColor: '#777777',
        borderRadius: '8px',
        border: '4px solid #222222',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    text: {
        flex: '4',
        backgroundColor: '#333333',
        borderRadius: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        padding: '30px',
    },
    effectsBar: {
        position: 'absolute',
        top: '57px',
        left: '3px',
    },
}






