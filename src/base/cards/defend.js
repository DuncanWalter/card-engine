import { Card, CardPartial } from './card'
import { DefendAction } from './../actions/defend'


type Meta = { blk: string }

export const defend = Symbol('defend');
export class Defend extends CardPartial<Meta> implements Card<Meta> {
    
    id: Symbol = defend
    block: number

    constructor(){
        super();
        this.energy = '1';
        this.color = '#223399';
        this.title = 'Defend';
        this.text = 'Gain 5 block';
        this.block = 5;
    }

    play({ resolver, actor, subject }){
        const blk = resolver.processAction(
            new DefendAction(
                this, 
                subject,
                this.block,
                'target',
            ),
        );
        return { blk };
    }

};