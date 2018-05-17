import { defineEffect, Effect } from "./effect"
import { damage } from '../events/damage'
import { Listener, ConsumerArgs } from '../events/listener';
import { blockable } from '../events/damage';
import { vulnerability } from "./vulnerability";
import { Card } from "../cards/card";
import { endTurn } from '../events/event';

export const latency = Symbol('latency');
export const Latency = defineEffect(latency, {
    name: 'Latency',
    innerColor: '#22ee33',
    outerColor: '#119922',
    description: '',
    sides: 3,
    rotation: 0.5,
}, {
    stacked: true, 
    delta: x => x - 1,
    min: 1,
    max: 99,
    on: endTurn,
}, owner => new Listener(
    latency,
    {
        filter: action => action.actors.has(owner),
        tags: [blockable],
        type: damage,
    },
    function*({ data }){
        if(typeof data.damage == 'number'){
            data.damage *= 0.75
        }
    },  
    false,
), [], [vulnerability])