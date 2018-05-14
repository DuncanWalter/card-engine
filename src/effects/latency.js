import { MetaEffect, Effect } from "./effect"
import { damage } from "../actions/damage"
import { Listener, ConsumerArgs } from "../actions/listener";
import { blockable } from "../actions/damage";
import { vulnerability } from "./vulnerability";
import { Card } from "../cards/card";
import { endTurn } from "../actions/action";

export const latency = Symbol('latency');
export const Latency: Class<Effect> = MetaEffect(latency, {
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
    function({ data }: ConsumerArgs<>): void {
        if(typeof data.damage == 'number'){
            data.damage *= 0.75
        }
    },  
    false,
), [], [vulnerability])