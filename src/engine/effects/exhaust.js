import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import { MetaEffect, Effect, tick } from "./effect"
import { damage, Damage } from "../actions/damage"
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from "../actions/bindEffect"
import { gameSlice } from "../gameState"
import { playCard, PlayCard } from "../actions/playCard"
import { Listener } from "../actions/listener"

export const exhaust = Symbol('exhaust')
export const Exhaust: Class<Effect> = MetaEffect(exhaust, {
    name: 'Exhaust',
    innerColor: '#343434',
    outerColor: '#565656',
    description: '',
}, {
    stacked: false, 
    delta: x => x,
    min: 1,
    max: 1,
}, (owner, self) => new Listener(
    exhaust,
    {
        subjects: [owner],
        type: playCard,
    },
    function({ game, data }: ConsumerArgs<>): void {
        data.destination = game.exhaustPile
    },
    false,  
), [], [playCard])