import { Card } from './card'
import { DefendAction } from './../actions/defend'

export const defend = Symbol('defend');

export function Defend(){
    return Card({
        id: defend,
        play({ resolver, actor, subject }){
            const blk = resolver.processAction(
                DefendAction(
                    this, 
                    subject,
                    this.block,
                    'target',
                ),
            );
            return { blk };
        },
        text: 'become an immortal (to anything dealing less than 5 damage)',
        title: 'hide',
        energy: '1',
        block: 5,
        color: '#223399',
    });
};