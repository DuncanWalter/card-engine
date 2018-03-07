import { MetaEffect, Effect, tick } from "./effect"
import { damage, Damage } from "../actions/damage"
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from "../actions/bindEffect"
import { gameSlice } from "../gameState"
import { Listener, ConsumerArgs } from "../actions/listener";

export const poison = Symbol('poison')
export const Poison: Class<Effect> = MetaEffect(poison, {
    name: 'Poison',
    outerColor: '#22bb33',
    innerColor: '#66ee88',
    description: '',
}, {
    stacked: true, 
    delta: x => x - 1,
    min: 1,
    max: 999,
}, (owner, self) => new Listener(
    poison,
    {
        subjects: [owner],
        tags: [tick, poison],
        type: bindEffect,
    },
    function({ resolver, subject, cancel }: ConsumerArgs<>): void {
        resolver.pushActions(new Damage({}, subject, {
            damage: self.stacks,
        }, poison))
    }, 
    false, 
), [tick], [])