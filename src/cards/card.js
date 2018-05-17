import type { ListenerGroup } from '../events/listener'
import type { EventResolver } from './../events/eventResolver'
import type { Event } from './../events/event'
import type { Component } from '../component'
import type { Game } from "../game/battle/battleState"
import { PlayCard } from '../events/playCard'
import { synchronize } from '../utils/async'
import { resolver } from '../events/eventResolver'
import { Effect, EffectState } from '../effects/effect'
import { renderEffect as EffectC } from '../effects/renderEffect'
import { createInterpolationContext, interpolate } from '../utils/textTemplate'
import { Entity } from '../utils/entity';
import { EffectGroup } from '../effects/effectGroup';

export type cardFactory = () => Card<> 

export interface PlayArgs<T: Object|void = {}|void> {
    actors: Set<Entity<any>> | Entity<any>,
    subject: Card<any>,
    target: T,
    resolver: EventResolver,
    game: $ReadOnly<Game>,
}

const cards = new Map()

function registerCard(type: string, play: (self: Card<>, args: PlayArgs<>) => Promise<any>): void {
    cards.set(type, play)
}

export interface CardState<Data: Object = any> {
    type: string,
    appearance: {
        color: string, // TODO: this is a stand in for images
        textTemplate: string,
        titleTemplate: string,
        energyTemplate: string,
    },
    data: Data,
    effects: EffectState[],
    id?: string,
}

// TODO: play args should have data and use another type argument
export class Card<Data:Object=any> extends Entity<CardState<Data>> {

    get appearance(): * {
        return this.inner.appearance
    }

    get data(): Data {
        return this.inner.data
    }

    get effects(): EffectGroup {
        return new EffectGroup(this.inner.effects)
    }

    get type(): string {
        return this.inner.type
    }

    get listener(): ListenerGroup {
        return this.effects.asListener(this)
    }

    play(ctx: PlayArgs<>){
        const cardBehavior = cards.get(this.type)
        if(cardBehavior){
            return cardBehavior(this, ctx)
        } else {
            throw new Error(`Unrecognized card type ${this.type}`)
        }
    }

    simulate({ actors, subject, target, resolver }: PlayArgs<>):{
        text: string,
        color: string,
        title: string,
        energy: string,
    }{
        let meta: Data = this.data
        resolver.simulate(resolver => {
            this.play({ actors, subject, target, resolver, game: resolver.state.getGame() }).then(v => meta = v)
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

    upgrade(){

    }

    clone(): Card<Data>{
        let raw = { ...this.unwrap() }
        if(raw.id){ 
            delete raw.id
        }
        raw.appearance = { ...raw.appearance }
        raw.data = { ...raw.data }

        return new Card(raw)
    }

    stacksOf(effectType: Symbol): number {
        let effects: EffectState[] = this.inner.effects.filter(effect => effect.type == effectType.toString())
        if(effects.length === 0){
            return 0
        } else {
            return effects[0].stacks
        }
    }

}



function any(any: any): any { return any }

export function defineCard<Meta: {}>(
    type: string, // unique string id
    play: (self: Card<Meta>, ctx: PlayArgs<>) => Generator<any, Meta, any>,
    data: Meta,
    appearance: {
        color: string,
        textTemplate: string,
        titleTemplate: string,
        energyTemplate: string,
    },
    ...effects: [(stacks: number) => Effect, number][]
): () => Card<Meta> {

    registerCard(type, synchronize(play))

    return function(){
        return new Card({
            appearance,
            effects: effects.map(([E, s]) => new E(s).unwrap()),
            type,
            data: { ...data },
        })
    }

}











