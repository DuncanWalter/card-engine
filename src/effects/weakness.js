import { MetaEffect, Effect } from "./effect"
import { damage } from "../actions/damage"
import { Listener, ConsumerArgs } from "../actions/listener";
import { blockable } from "../actions/damage";
import { vulnerability } from "./vulnerability";
import { Card } from "../cards/card";
import { Player } from "../creatures/player";
import { endTurn } from "../actions/action";

export const weakness = Symbol('weakness');
export const Weakness: Class<Effect> = MetaEffect(weakness, {
    name: 'Weakness',
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
    weakness,
    {
        filter: action => action.actor instanceof Card && owner instanceof Player || action.actor == owner,
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