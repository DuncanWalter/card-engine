import { Card as Component } from './../components/hud/card'
import { gameState } from './../gameState'
import { PlayCardAction } from '../actions/playCard'
import { construct } from './../../utility/construct'

import type { ActionResolver } from './../actions/actionResolver'
import type { Action } from './../actions/action'

export interface Card<Meta> {
    id: Symbol,
    render(any): any,
    // should be acquired from localization?
    title: string,
    text: string,
    energy: string,
    color: string,
    listener?: *,
    play(ctx: PlayCtx): Meta, 
};

type Mixin = {
    id: Symbol,
    title: string,
    text: string,
    energy: string,
    play: (ctx: PlayCtx) => PlayCardAction, 
    color: string,
};

type PlayCtx = {
    actor: any,
    subject: any,
    resolver: ActionResolver,
}

const game: * = gameState.view();

export class CardPartial<Meta> {

    title: string
    text: string
    energy: string
    color: string

    id: Symbol
    +play: (ctx: PlayCtx) => Meta

    constructor(){
        // NO OP
    }

    render(props: any){
        const that = this;
        return (<div 
            onClick={e => {
                // TODO: put the action resolver on the global object? or nah?
                game.actionResolver.enqueueAction(
                    (new PlayCardAction(
                        game.player, 
                        that, 
                        game.enemies[0]
                    ): Action<any, any, any>)
                );

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
