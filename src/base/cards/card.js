import { Card as Component } from './../components/hud/card'
import { global } from './../../core/app'
import { PlayCardAction } from '../actions/playCard'
import { construct } from './../../utility/construct'

import type { ActionResolver } from './../actions/actionResolver'
import type { Action } from './../actions/action'

export type CardT = {
    id: Symbol,
    render: (any) => any,
    // should be acquired from localization?
    title: string,
    text: string,
    energy: string,
    color: string,
    listener?: *,
    play: (ctx: PlayCtx) => Action, 
};

type Mixin = {
    id: Symbol,
    title: string,
    text: string,
    energy: string,
    play: (ctx: PlayCtx) => Action, 
    color: string,
};

type PlayCtx = {
    actor: any,
    subject: any,
    resolver: ActionResolver,
}

const { assign, create } = Object;

const cardProto = construct(null, {
    render(props){
        const that = this;
        return (<div 
            onClick={e => {
                console.log('clicked', global);
                const ar: ActionResolver = global.actionResolver;
                ar.enqueueAction(
                    PlayCardAction(global.player, that, global.enemy)
                );
            }}><Component 
                title={this.title}
                text={this.text}
                energy={this.energy}
                color={this.color}
            />
        </div>);
    }
});

export function Card(mixin: Mixin): CardT {
    return construct(cardProto, mixin);
};

