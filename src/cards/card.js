import type { ListenerGroup } from '../actions/listener'
import type { ActionResolver } from './../actions/actionResolver'
import type { Action } from './../actions/action'
import type { Component } from '../component'
import { PlayCard } from '../actions/playCard'
import { synchronize } from '../utils/async'
import { GameState } from "../game/battle/battleState"
import { resolver } from "../actions/actionResolver"
import { Effect } from '../effects/effect'
import { renderEffect as EffectC } from '../effects/renderEffect'
import { createInterpolationContext, interpolate } from '../utils/textTemplate'
import { state } from '../state'

export interface PlayArgs<A: Object={}, T: Object|void = {}|void> {
    actor: A,
    subject: Card<any>,
    target: T,
    resolver: ActionResolver,
    game: $ReadOnly<GameState>,
}

// TODO: play args should have data and use another type argument
export class Card<Data: Object = {}> {
    id: Symbol
    appearance: {
        color: string, // TODO: this is a stand in for images
        textTemplate: string,
        titleTemplate: string,
        energyTemplate: string,
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
            this.play({ actor, subject, target, resolver, game: state.battle }).then(v => meta = v)
        })

        let ctx = createInterpolationContext(this.data, meta, {})

        return {
            energy: interpolate(this.appearance.energyTemplate, ctx),
            title: interpolate(this.appearance.titleTemplate, ctx),
            text: interpolate(this.appearance.textTemplate, ctx),
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
        textTemplate: string,
        titleTemplate: string,
        energyTemplate: string,
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











