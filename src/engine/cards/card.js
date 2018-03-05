import { PlayCard } from '../actions/playCard'
import { gameSlice } from '../gameState'

import type { ActionResolver, Listener, Listeners } from './../actions/actionResolver'
import type { Effect } from '../effects/effect'
import type { Action } from './../actions/action'

export interface PlayArgs<A: Object={}, T: Object|void = {}|void> {
    actor: A,
    subject: Card<any>,
    target: T,
    resolver: ActionResolver,
}

// TODO: play args should have data and use another type argument
export class Card<Data> {
    id: Symbol
    appearance: {
        color: string, // TODO: this is a stand in for images
        textTemplate: (meta: Data) => string,
        titleTemplate: (meta: Data) => string,
        energyTemplate: (meta: Data) => string,
    }
    data: Data
    listener: Listeners = []
    effects: Effect[]

    play: (ctx: PlayArgs<>) => Data // TODO: strong type these?

    simulate({ actor, subject, target, resolver }: PlayArgs<>):{
        text: string,
        color: string,
        title: string,
        energy: string,
    }{
        let meta: Data = any()
        resolver.simulate(resolver => {
            meta = this.play({ actor, subject, target, resolver })
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

export function MetaCard<Meta>(
    id: Symbol,
    play: (ctx: PlayArgs<>) => Meta,
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
            this.play = play
            this.id = id
            this.appearance = appearance
            this.effects = effects.map(([E, s]) => new E(this, s))
            this.listener = any([this.effects])
        }
    }
}