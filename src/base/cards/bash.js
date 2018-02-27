import { Card, CardPartial, PlayArgs } from './card'
import { Damage, damage, targeted } from './../actions/damage'
import { Listener } from '../actions/actionResolver';
import { BindEffect } from '../actions/bindEffect';
import { vulnerable } from '../effects/vulnerable';
import { blockable } from '../effects/block';

type Meta = { dmg: string }

export const bash = Symbol('bash');
export class Bash extends CardPartial<Meta> implements Card<Meta> {
    
    id: Symbol = bash
    damage: number

    constructor(){
        super();
        this.energy = '1';
        this.color = '#bb4433';
        this.title = 'Bash';
        this.text = 'Deal 5 damage and 1 weakness to one target';
        this.damage = 5;
        this.listener = {
            id: bash,
            header: {
                actors: [console.log('this', this)||this],
                tags: [damage],
            },
            consumer({ resolver, subject }: *){
                resolver.processAction(new BindEffect(this.owner, subject, {
                    effect: vulnerable, 
                    stacks: 2,
                }))
            },
        }
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