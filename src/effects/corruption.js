import { defineEffect, Effect, tick } from "./effect"
import { damage, Damage } from '../events/damage'
import { vulnerability } from "./vulnerability"
import { bindEffect } from '../events/bindEffect'
import { Listener, ConsumerArgs } from '../events/listener';

export const corruption = Symbol('corruption')
export const Corruption = defineEffect(corruption, {
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
        yield resolver.processEvent(new Damage(self, subject, {
            damage: self.stacks,
        }, corruption))
    }, 
    false, 
), [tick], [])