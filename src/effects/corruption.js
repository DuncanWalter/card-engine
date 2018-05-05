import { MetaEffect, Effect, tick } from "./effect"
import { damage, Damage } from "../actions/damage"
import { vulnerability } from "./vulnerability"
import { bindEffect } from "../actions/bindEffect"
import { Listener, ConsumerArgs } from "../actions/listener";

export const corruption = Symbol('corruption')
export const Corruption: Class<Effect> = MetaEffect(corruption, {
    name: 'Corruption',
    outerColor: '#332233',
    innerColor: '#661166',
    description: '',
    sides: 6,
}, {
    stacked: true, 
    delta: x => x + 1,
    min: 1,
    max: 999,
}, (owner, self) => new Listener(
    corruption,
    {
        subjects: [owner],
        tags: [tick, corruption],
        type: bindEffect,
    },
    function*({ resolver, subject, cancel }: ConsumerArgs<>): * {
        yield resolver.processAction(new Damage({}, subject, {
            damage: self.stacks,
        }, Corruption))
    }, 
    false, 
), [tick], [])