import { MetaEffect, Effect } from "./effect"
import { damage } from "../actions/damage"
import { Listener, ConsumerArgs } from "../actions/listener"
import { vulnerability } from "./vulnerability"
import { bindEffect } from "../actions/bindEffect";

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
    function({ cancel }: ConsumerArgs<>): void {
        cancel()
    },  
    false,
), [vulnerability], [bindEffect])