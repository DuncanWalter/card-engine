import { Card, CardPartial, PlayArgs } from './card'
import { BindEffect } from '../actions/bindEffect';
import { block } from '../effects/block';


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

    play({ resolver, actor, subject }: PlayArgs){
        const action = resolver.processAction(
            new BindEffect(
                this, 
                subject,
                {
                    effect: block,
                    stacks: this.block,
                },
                block,
            ),
        );
        return { blk: action.data.stacks };
    }

};