import { MetaEffect, Effect, tick } from "./effect"
import { damage } from "../actions/damage"
import type { ListenerGroup } from "../actions/listener"
import { Block, block } from "./block"
import { bindEffect } from "../actions/bindEffect"
import { Card } from "../cards/card"
import { Listener, ConsumerArgs } from "../actions/listener";

export const blockade = Symbol('blockade');
export const Blockade: Class<Effect> = MetaEffect(blockade, {
    name: 'Blockade',
    innerColor: '#2233bb',
    outerColor: '#6688ee',
    description: '',
    sides: 30,
    rotation: 0,
}, {
    stacked: false, 
    delta: x => x,
    min: 1,
    max: 1,
}, (owner: { effects: Effect[] }, self: Effect) => new Listener(
    blockade,
    {
        subjects: [owner],
        tags: [tick, block],
        type: bindEffect,
    },
    function({ data, actor, cancel }: ConsumerArgs<>): void{
        if(data.stacks < 0){
            cancel()
        }
    },
    false,
), [], [bindEffect])