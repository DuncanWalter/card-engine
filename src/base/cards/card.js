import { Card as Component } from './../components/hud/card'
import { gameState } from './../gameState'
import { PlayCard } from '../actions/playCard'
import { construct } from './../../utility/construct'

import type { ActionResolver, Listener, Listeners } from './../actions/actionResolver'
import type { Action } from './../actions/action'

export interface Card<Meta> {
    id: Symbol,
    render(any): any,
    // should be acquired from localization TODO:
    title: string,
    text: string,
    energy: string,
    color: string,
    listener?: *,
    play(ctx: PlayArgs): Meta, 
};

type Mixin = {
    id: Symbol,
    title: string,
    text: string,
    energy: string,
    play: (ctx: PlayArgs) => PlayCard, 
    color: string,
};

export interface PlayArgs {
    actor: any,
    subject: any,
    resolver: ActionResolver,
}

const game = gameState

// TODO: If I make a meta constructor, does that make things easier?


export class CardPartial<Meta> {

    title: string
    text: string
    energy: string
    color: string

    listener: Listeners

    header: $PropertyType<Listener<>, 'header'> = {}

    id: Symbol
    +play: (ctx: PlayArgs) => Meta

    constructor(){
        this.listener = [];
    }

    render(props: any){
        const that = this;
        return (<div 
            onClick={e => {
                // TODO: put the action resolver on the global object? or nah?
                game.resolver.enqueueAction(
                    new PlayCard(
                        game.player, 
                        that, 
                        {
                            target: game.enemies[0],
                            success: false,
                        }
                    )
                )
                console.log(game.player, game.enemies[0], game.hand.length);
            }}><Component 
                title={this.title}
                text={this.text}
                energy={this.energy}
                color={this.color}
            />
        </div>);
    }
}
