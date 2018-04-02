import type { ListenerGroup } from '../actions/listener'
import type { ActionResolver } from './../actions/actionResolver'
import type { Action } from './../actions/action'
import type { Component } from '../component'
import { PlayCard } from '../actions/playCard'
import { synchronize } from '../utils/async'
import { state as game } from "../game/battle/battleState"
import { state as view, dispatcher } from "../game/viewState"
import { resolver } from "../actions/actionResolver"
import { Entity } from '../components/entity'
import { Effect } from '../effects/effect'
import { renderEffect as EffectC } from '../effects/renderEffect'

export interface PlayArgs<A: Object={}, T: Object|void = {}|void> {
    actor: A,
    subject: Card<any>,
    target: T,
    resolver: ActionResolver,
}

// TODO: play args should have data and use another type argument
export class Card<Data: Object = {}> {
    id: Symbol
    appearance: {
        color: string, // TODO: this is a stand in for images
        textTemplate: (meta: Data) => string,
        titleTemplate: (meta: Data) => string,
        energyTemplate: (meta: Data) => string,
    }
    data: Data
    listener: ListenerGroup = []
    effects: Effect[]

    play: (ctx: PlayArgs<>) => Promise<Data> // TODO: strong type these?

    simulate({ actor, subject, target, resolver }: PlayArgs<>):{
        text: string,
        color: string,
        title: string,
        energy: string,
    }{
        let meta: Data = this.data
        resolver.simulate(resolver => {
            this.play({ actor, subject, target, resolver }).then(v => meta = v)
        })

        Object.keys(meta).forEach(k => {
            if(typeof meta[k] == 'number'){
                if(meta[k] < this.data[k]){
                    meta[k] = <span style={{color: 'red'}}>{meta[k]}</span>
                } else if(meta[k] > this.data[k]){
                    meta[k] = <span style={{color: 'green'}}>{meta[k]}</span>
                }
            } 
        })

        return {
            energy: this.appearance.energyTemplate(meta),
            title: this.appearance.titleTemplate(meta),
            text: this.appearance.textTemplate(meta),
            color: this.appearance.color,
        }
    }
}

function any(any: any): any { return any }

export function MetaCard<Meta: Object>(
    id: Symbol,
    play: ((ctx: PlayArgs<>) => Meta) | ((ctx: PlayArgs<>) => Generator<any, Meta, any>),
    data: Meta,
    appearance: {
        color: string,
        textTemplate: (meta: Meta) => string,
        titleTemplate: (meta: Meta) => string,
        energyTemplate: (meta: Meta) => string,
    },
    ...effects: [Class<Effect>, number][]
){
    // TODO: WTH does this need to be any?
    return class CustomCard extends Card<any> {
        constructor(){
            super()
            this.data = Object.assign({ }, data)
            this.play = synchronize(play, this)
            this.id = id
            this.appearance = appearance
            this.effects = effects.map(([E, s]) => new E(this, s))
            this.listener = any([this.effects])
        }
    }
}




const a: any = Object.assign

type Props = {
    card: Card<any>,
}

export const renderCard: Component<Props> = ({ card }: Props) => {

    // TODO: need to rework the energy part to check for price and playability 
    let { energy, color, text, title } = card.simulate({
        actor: game.player, // TODO: make this player and target
        subject: card,
        target: game.enemies[0], 
        resolver: resolver,
        data: card.data,
    })

    const clicked = e => {
        // use a dispatch and a display state TODO:
        resolver.enqueueActions(
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

    return <Entity entity={card}>
        <div 
            style={sty.base(card == view.cursorFocus)} 
            onClick={clicked}
            onMouseEnter={e => dispatcher.setCursorFocus(card)}
            onMouseLeave={e => dispatcher.unsetCursorFocus(card)}
        >   
            <div style={sty.effectsBar}>
                {card.effects.map(e => <EffectC effect={e}/>)}
            </div>
            <div style={sty.costBack}>{energy}</div>
            <div style={sty.title}>{title}</div>
            <div style={{ backgroundColor: color, ...sty.image }}></div>
            <div style={sty.text}>{text}</div>
        </div>
    </Entity>
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







