import { construct } from './../../utility/construct' 
import { gameState } from '../gameState';

import type { Action, ConsumerArgs } from './action'

type HasHealth = {
    health: number,
}

export const damageAction = Symbol('damageAction');
export class DamageAction implements Action<any, HasHealth, DamageAction> {
    
    id: Symbol = damageAction;
    damage: number
    subject: { health:  number }
    actor: any
    tags: Array<string>

    constructor(actor: any, subject: { health: number }, damage: number, ...tags: Array<string>){
        this.damage = damage;
        this.actor = actor;
        this.subject = subject;
        this.tags = ['damage', ...tags];
    }
    
    consumer({ action, subject, cancel }: ConsumerArgs<any, HasHealth, DamageAction>){ 
        if(action.damage <= 0){
            cancel();
        } else {
            subject.health -= action.damage;
        }
    }
}






