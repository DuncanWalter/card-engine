import { MetaEffect, Effect } from "./effect"
import { damage } from "../actions/damage"
import { Listener, ConsumerArgs } from "../actions/listener";
import { blockable } from "../actions/damage";
import { latency } from "./latency";
import { Card } from "../cards/card";
import { Player } from "../creatures/player";

export const strength = Symbol('strength');
export const Strength: Class<Effect> = MetaEffect(strength, {
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
        filter: action => action.actors.has(owner),
        tags: [blockable],
        type: damage,
    },
    function({ data }: ConsumerArgs<>): void {
        if(typeof data.damage == 'number'){
            data.damage += self.stacks
        }
    },  
    false,
), [], [latency])