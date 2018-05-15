import { MetaEffect, Effect } from "./effect"
import { damage, targeted } from '../events/damage'
import { block, Block } from "./block"
import { bindEffect } from '../events/bindEffect'
import { Card } from "../cards/card"
import { ConsumerArgs, Listener } from '../events/listener';

export const dexterity = Symbol('dexterity');
export const Dexterity: Class<Effect> = MetaEffect(dexterity, {
    name: 'Dexterity',
    outerColor: '#22aa88',
    innerColor: '#115544',
    description: '',
    sides: 30,
    rotation: 0,
}, {
    stacked: true, 
    delta: x => x,
    min: 1,
    max: 99,
}, (owner, self) => new Listener(
    dexterity,
    {
        subjects: [owner],
        filter: action => action.data.Effect == Block,
        type: bindEffect,
        tags: [targeted],
    },
    function*({ data, actors }){
        // TODO: fix this to not boost effect blocks
        if(true){
            console.log('fix dexterity')
            if(typeof data.stacks == 'number'){
                if(data.stacks >= 0){
                    data.stacks += self.stacks
                }
            }
        }
    },  
    false,
), [], [bindEffect])