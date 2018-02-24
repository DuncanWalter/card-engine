import { construct } from './../../utility/construct' 
import { gameState } from '../gameState'

import type { Card } from './../cards/card'
import type { Action, ConsumerArgs } from './action'

type HasEnergy = {
    energy: number,
}

export const playCardAction = Symbol('playCardAction');
export class PlayCardAction implements Action<any, Card<any>, PlayCardAction> {
    
    id: Symbol = playCardAction
    subject: Card<any>
    actor: any
    tags: Array<string>
    target: any

    constructor(actor: any, subject: Card<any>, target: any, ...tags: Array<string>){
        this.actor = actor;
        this.subject = subject;
        this.tags = ['playCard', ...tags];
        this.target = target;
    }
    
    consumer({ action, subject, actor, resolver }: ConsumerArgs<any, Card<any>, PlayCardAction>){ 
        // TODO: perform an energy check
        actor.energy -= 1; //TODO: (subject: CardT).energy;
        subject.play({ 
            resolver, 
            actor: subject, 
            subject: action.target,
        });

        const game = gameState.view();

        game.discardPile.push(game.hand.splice(game.hand.indexOf(subject), 1));

        gameState.emit();
    }
}