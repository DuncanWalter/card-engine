import type { Component } from '../component'
import type { Card as CardObject } from './card'
import type { State } from '../state';
import { Entity } from '../components/entity'
import { resolver } from '../actions/actionResolver'
import { PlayCard } from '../actions/playCard'
import { renderEffect as EffectComponent } from '../effects/renderEffect'
import { withState } from '../state';
import { CardLibrary } from './cardLibrary';
import { Rarity } from './cardSet';

interface Props {
    card: CardObject<>,
    state: State,
}

export const Card: Component<Props> = withState(({ card, state }) => {

    const actors = new Set()
    actors.add(state.battle.player)
    actors.add(card)

    // TODO: need to rework the energy part to check for price and playability 
    let { energy, color, text, title } = card.simulate({
        actors,
        subject: card,
        target: state.battle.dummy, 
        resolver: resolver,
        data: card.data,
        game: state.battle,
    })

    let cardMembership = CardLibrary.getCardMembership(state.battle.player, card)

    const clicked = e => {
        // use a dispatch and a display state TODO:
        resolver.enqueueActions(
            new PlayCard(
                state.battle.player, 
                card,
                {
                    from: state.battle.hand,
                }
            )
        )
    }

    return <Entity entity={card}>
        <div 
            style={sty.base(card == state.entity.cursorFocus, cardMembership)} 
            onClick={clicked} 
        >   
            <div style={sty.effectsBar}>{
                card.effects.map(effect => 
                    <EffectComponent effect={effect}/>
                )
            }</div>
            <div style={sty.costBack(cardMembership)}>{energy}</div>
            <div style={sty.title(cardMembership)}>{title}</div>
            <div style={{ backgroundColor: color, ...sty.image }}></div>
            <div style={sty.text(cardMembership)}>{text}</div>
        </div>
    </Entity>
})

function colorRarity(rarity: Rarity){
    switch(rarity){
        case 'A': return "#775511"
        case 'B': return "#552255"
        case 'C': return "#225577"
        case 'D': return "#226644"
        case 'F': return "#333344"
    }
}

const sty = {
    base(isFocus, cardMembership: *){
        return {
            minWidth: '280px',
            minHeight: '440px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: cardMembership? colorRarity(cardMembership.rarity): isFocus? '#444444': '#222222',
            position: 'relative',
            borderRadius: '8px',
            padding: '4px',
            cursor: 'pointer',
            color: '#ffeedd',
        }
    },
    title(cardMembership){ return {
        // flex: '1',
        height: '50px',
        backgroundColor: cardMembership? cardMembership.color: '#555555',
        borderRadius: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    }},
    image: {
        flex: '5',
        borderRadius: '8px',
        borderBottom: '4px solid #222222',
        borderTop: '4px solid #222222',
    },
    costBack(cardMembership){ return {
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
    }},
    text(cardMembership){ return {
        height: '210px',
        backgroundColor: cardMembership? cardMembership.color: '#333333',
        borderRadius: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        padding: '5px 30px 5px',
    }},
    effectsBar: {
        position: 'absolute',
        top: '57px',
        left: '3px',
    },
}