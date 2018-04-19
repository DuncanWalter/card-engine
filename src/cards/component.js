import type { Component } from '../component'
import type { Card as CardObject } from './card'
import type { State } from '../state';
import { Entity } from '../components/entity'
import { resolver } from '../actions/actionResolver'
import { PlayCard } from '../actions/playCard'
import { renderEffect as EffectComponent } from '../effects/renderEffect'
import { withState } from '../state';

interface Props {
    card: CardObject<>,
    state: State,
}

export const Card: Component<Props> = withState(({ card, state }) => {

    // TODO: need to rework the energy part to check for price and playability 
    let { energy, color, text, title } = card.simulate({
        actor: state.battle.player,
        subject: card,
        target: state.battle.dummy, 
        resolver: resolver,
        data: card.data,
        game: state.battle,
    })

    const clicked = e => {
        // use a dispatch and a display state TODO:
        resolver.enqueueActions(
            new PlayCard(
                state.battle.player, 
                card,
                {
                    target: state.battle.dummy,
                    success: false,
                }
            )
        )
    }

    return <Entity entity={card}>
        <div 
            style={sty.base(card == state.entity.cursorFocus)} 
            onClick={clicked} 
        >   
            <div style={sty.effectsBar}>{
                card.effects.map(effect => 
                    <EffectComponent effect={effect}/>
                )
            }</div>
            <div style={sty.costBack}>{energy}</div>
            <div style={sty.title}>{title}</div>
            <div style={{ backgroundColor: color, ...sty.image }}></div>
            <div style={sty.text}>{text}</div>
        </div>
    </Entity>
})


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