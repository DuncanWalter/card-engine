import type { ListenerGroup } from '../actions/listener'
import type { ActionResolver } from './../actions/actionResolver'
import type { Action } from './../actions/action'
import type { Component } from '../component'
import { PlayCard } from '../actions/playCard'
import { synchronize } from '../utils/async'
import { Game } from "../game/battle/battleState"
import { resolver } from "../actions/actionResolver"
import { Effect } from '../effects/effect'
import { renderEffect as EffectC } from '../effects/renderEffect'
import { createInterpolationContext, interpolate } from '../utils/textTemplate'
import { state } from '../state'

export const cardFactory = {
    cards: (new Map(): Map<string, Class<Card<any>>>),
    register(id: string, Constructor: Class<Card<any>>): void {
        this.cards.set(id, Constructor)
    },
    create(id: string): Card<any> {
        let Cons = this.cards.get(id)
        if(Cons){
            return new Cons()
        } else {
            throw new Error(`no registered card type with id ${id}`)
        }
    },
}

export interface PlayArgs<A: Object={}, T: Object|void = {}|void> {
    actors: Set<A>,
    subject: Card<any>,
    target: T,
    resolver: ActionResolver,
    game: $ReadOnly<Game>,
}

// TODO: play args should have data and use another type argument
export class Card<Data: Object = any> {
    id: string
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

    simulate({ actors, subject, target, resolver }: PlayArgs<>):{
        text: string,
        color: string,
        title: string,
        energy: string,
    }{
        let meta: Data = this.data
        resolver.simulate(resolver => {
            this.play({ actors, subject, target, resolver, game: state.battle }).then(v => meta = v)
        })

        Object.keys(meta).forEach(key => {
            if(typeof meta[key] === 'number'){
                meta[key] = Math.floor(meta[key])
            }
        })

        let ctx = createInterpolationContext(this.data, meta, {})

        return {
            energy: interpolate(this.appearance.energyTemplate, ctx),
            title: interpolate(this.appearance.titleTemplate, ctx),
            text: interpolate(this.appearance.textTemplate, ctx),
            color: this.appearance.color,
        }
    }

    upgrades(){

    }

    clone(){
        return cardFactory.create(this.id)
    }

    stacksOf(effectType: Symbol): number {
        let effects: Effect[] = this.effects.filter(effect => effect.id == effectType)
        if(effects.length === 0){
            return 0
        } else {
            return effects[0].stacks
        }
    }

}

function any(any: any): any { return any }

export function MetaCard<Meta: {}>(
    id: string,
    play: ((ctx: PlayArgs<>) => Meta) | ((ctx: PlayArgs<>) => Generator<any, Meta, any>),
    data: Meta,
    appearance: {
        color: string,
        textTemplate: string,
        titleTemplate: string,
        energyTemplate: string,
    },
    ...effects: [Class<Effect>, number][]
): Class<Card<Meta>> {
    // TODO: WTH does this need to be any?
    class CustomCard extends Card<Meta> {
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

    cardFactory.register(id, CustomCard)

    return CustomCard
}











