import type { ListenerGroup } from '../actions/listener'
import type { ActionResolver } from './../actions/actionResolver'
import type { Action } from './../actions/action'
import type { Component } from '../component'
import { PlayCard } from '../actions/playCard'
import { synchronize } from '../utils/async'
import { battleSlice, GameState } from "../game/battle/battleState"
import { resolver } from "../actions/actionResolver"
import { Entity, entitySlice } from '../components/entity'
import { Effect } from '../effects/effect'
import { renderEffect as EffectC } from '../effects/renderEffect'
import { createInterpolationContext, interpolate } from '../utils/textTemplate'

const battle = battleSlice.state

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
        textTemplate: (meta: Data) => string | string,
        titleTemplate: (meta: Data) => string | string,
        energyTemplate: (meta: Data) => string | string,
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
            this.play({ actor, subject, target, resolver, game: battle }).then(v => meta = v)
        })

        let ctx = createInterpolationContext(this.data, meta, {})

        return {
            energy: typeof this.appearance.energyTemplate == 'string' ? interpolate(this.appearance.energyTemplate, ctx) : this.appearance.energyTemplate(meta),
            title: typeof this.appearance.titleTemplate == 'string' ? interpolate(this.appearance.titleTemplate, ctx) : this.appearance.titleTemplate(meta),
            text: typeof this.appearance.textTemplate == 'string' ? interpolate(this.appearance.textTemplate, ctx) : this.appearance.textTemplate(meta),
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
        textTemplate: (meta: Meta) => string | string,
        titleTemplate: (meta: Meta) => string | string,
        energyTemplate: (meta: Meta) => string | string,
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











