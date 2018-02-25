import { construct } from './../../utility/construct' 
import { gameState } from './../gameState'
import type { Action, ConsumerArgs } from './action'

type HasBlock = {
    block: number,
}

export const defendAction = Symbol('defendAction');
export class DefendAction implements Action<any, HasBlock, DefendAction> {
    
    id: Symbol = defendAction
    block: number
    subject: HasBlock
    actor: any
    tags: Array<string>

    constructor(actor: any, subject: HasBlock, block: number, ...tags: Array<string>){
        this.block = block;
        this.actor = actor;
        this.subject = subject;
        this.tags = ['block', ...tags];
    }
    
    consumer({ action, subject, cancel }: ConsumerArgs<any, HasBlock, DefendAction>){
        if(action.block <= 0){
            cancel();
        } else {
            subject.block += action.block;
        }
    }
}
