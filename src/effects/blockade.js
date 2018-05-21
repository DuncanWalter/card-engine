import { defineEffect, Effect, tick } from "./effect"
import { damage } from '../events/damage'
import type { ListenerGroup } from '../events/listener'
import { Block, block } from "./block"
import { bindEffect } from '../events/bindEffect'
import { Card } from "../cards/card"
import { Listener, ConsumerArgs } from '../events/listener'
import { EffectGroup } from "./effectGroup"

export const blockade = 'blockade';
export const Blockade = defineEffect(blockade, {
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
}, (owner: { +effects: EffectGroup }, self: Effect) => new Listener(
    blockade,
    {
        subjects: [owner],
        tags: [tick, block],
        type: bindEffect,
    },
    function*({ data, actor, cancel }){
        if(data.stacks < 0){
            cancel()
        }
    },
    false,
), [], [bindEffect])