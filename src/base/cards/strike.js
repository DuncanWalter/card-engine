import { Card, CardPartial, PlayArgs } from './card'
import { Damage, targeted } from './../actions/damage'
import { blockable } from '../effects/block';

type Meta = { dmg: string }

export const strike = Symbol('strike');
export class Strike extends CardPartial<Meta> implements Card<Meta> {
    
    id: Symbol = strike
    damage: number

    constructor(){
        super();
        this.energy = '1';
        this.color = '#993322';
        this.title = 'Strike';
        this.text = 'Deal 6 damage to one target';
        this.damage = 6;
    }

    play({ resolver, actor, subject }: PlayArgs){
        const dmg = resolver.processAction(
            new Damage(
                this, 
                subject,
                {
                    damage: this.damage,
                },
                targeted, 
                blockable,
            ),
        );
        return { dmg };
    }

};