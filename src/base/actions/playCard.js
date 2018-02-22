import { construct } from './../../utility/construct' 
import { Action } from './action'
import { global } from './../../core/app'

import type { CardT } from './../cards/card'

export function PlayCardAction(actor: {energy: number}, subject: CardT, target: mixed, ...tags: Array<string>){
    let pca = Action(({ resolver, action, subject, actor }) => { 
        actor.energy -= 1; //TODO: (subject: CardT).energy;
        
        (subject: CardT).play({ 
            resolver, 
            actor: subject, 
            subject: target,
        });

        global.discardPile.push(global.hand.splice(global.hand.indexOf(subject), 1));
    }, actor, subject, 'playCard', ...tags);
    return pca;
}