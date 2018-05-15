import { MetaEffect, Effect } from "./effect"
import { damage } from '../events/damage'
import { Listener, ConsumerArgs } from '../events/listener'
import { vulnerability } from "./vulnerability"
import { bindEffect } from '../events/bindEffect';

export const imperturbability = Symbol('imperturbability')
export const Imperturbability: Class<Effect> = MetaEffect(imperturbability, null, {
    stacked: false, 
    delta: x => x,
    min: 1,
    max: 1,
}, owner => new Listener(
    imperturbability,
    {
        subjects: [owner],
        type: bindEffect,
    },
    function*({ cancel }){
        cancel()
    },  
    false,
), [vulnerability], [bindEffect])