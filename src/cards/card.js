import type { ListenerGroup } from '../actions/listener'
import type { ActionResolver } from './../actions/actionResolver'
import type { Effect } from '../effects/effect'
import type { Action } from './../actions/action'
import { PlayCard } from '../actions/playCard'
import { gameSlice } from '../gameState'
import { synchronize } from '../utils/async'

export interface PlayArgs<A: Object={}, T: Object|void = {}|void> {
    actor: A,
    subject: Card<any>,
    target: T,
    resolver: ActionResolver,
}

// TODO: play args should have data and use another type argument
export class Card<Data: Object> {
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