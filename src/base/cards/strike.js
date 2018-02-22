import { Card } from './card'
import { DamageAction } from './../actions/damage'

export const strike = Symbol('strike');

export function Strike(){
    return Card({
        id: strike,
        play({ resolver, actor, subject }){
            const dmg = resolver.processAction(
                DamageAction(
                    this, 
                    subject,
                    this.damage,
                    'target',
                ),
            );
            return { dmg };
        },
        text: 'hit a dude for 6 damage',
        title: 'pop',
        energy: '12',
        damage: 6,
        color: '#993322',
    });
};