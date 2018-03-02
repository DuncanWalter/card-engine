import { Card as Component } from './../../chassis/components/hud/card'
import { PlayCard } from '../actions/playCard'

import type { ActionResolver, Listener, Listeners } from './../actions/actionResolver'
import type { Action } from './../actions/action'

export interface Card<Meta> {
    id: Symbol,
    titleTemplate: (meta: Meta) => string,
    textTemplate: (meta: Meta) => string,
    energyTemplate: (meta: Meta) => string,
    color: string,
    energy: number,
    listener: Listeners,
    play(ctx: PlayArgs<>): Meta, // TODO: strong type these?
    simulate(ctx: PlayArgs<>): {
        text: string,
        color: string,
        title: string,
        energy: string,
    }
}

export interface PlayArgs<A: Object={}, S: Object={}> {
    actor: A,
    subject: S,
    resolver: ActionResolver,
}



// TODO: Meta construction needed?

export class CardPartial<Meta> {

    titleTemplate: (meta: Meta) => string
    textTemplate: (meta: Meta) => string
    energyTemplate: (meta: Meta) => string
    color: string
    energy: number

    listener: Listeners

    header: $PropertyType<Listener<>, 'header'> = {}

    id: Symbol
    +play: (ctx: PlayArgs<>) => Meta
    
    constructor(){
        this.listener = [];
    }
    
    simulate({ actor, subject, resolver }: PlayArgs<>){
        let meta = ({}: any)
        resolver.simulate(resolver => {
            meta = this.play({ actor, subject, resolver })
        })
        return {
            energy: this.energyTemplate(meta),
            title: this.titleTemplate(meta),
            text: this.textTemplate(meta),
            color: this.color,
        }
    }
}
