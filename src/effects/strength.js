import { defineEffect, Effect } from "./effect"
import { damage } from '../events/damage'
import { Listener, ConsumerArgs } from '../events/listener';
import { blockable } from '../events/damage';
import { latency } from "./latency";
import { Card } from "../cards/card";

export const strength = Symbol('strength');
export const Strength = defineEffect(strength, {
    name: 'Strength',
    innerColor: '#ee4444',
    outerColor: '#aa3333',
    description: '',
    sides: 3,
    rotation: 0,
}, {
    stacked: true, 
    delta: x => x,
    min: 1,
    max: 99,
}, (owner, self) => new Listener(
    strength,
    {
        actors: [owner],
        tags: [blockable],
        type: damage,
    },
    function*({ data }){
        if(typeof data.damage == 'number'){
            data.damage += self.stacks
        }
    },  
    false,
), [], [latency])