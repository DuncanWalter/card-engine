import type { ListenerGroup, ConsumerArgs } from '../events/listener'
import { MetaEffect, Effect, tick } from "./effect"
import { damage, Damage } from '../events/damage'
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from '../events/bindEffect'
import { playCard, PlayCard } from '../events/playCard'
import { Listener } from '../events/listener'
import { addToDiscardPile } from '../events/addToDiscard';
import { Card } from "../cards/card";
import { AddToDrawPile } from '../events/addToDrawPile';

export const default$ = Symbol('default$')
export const Default: Class<Effect> = MetaEffect(default$, {
    name: 'Default',
    innerColor: '#343434',
    outerColor: '#565656',
    description: '',
    sides: 30,
}, {
    stacked: false, 
    delta: x => x,
    min: 1,
    max: 1,
}, (owner, self) => new Listener(
    default$,
    {
        subjects: [owner],
        type: addToDiscardPile,
        tags: [playCard],
    },
    function*({ game, data, resolver, cancel }: ConsumerArgs<>): * {
        if(owner instanceof Card){
            yield resolver.processEvent(new AddToDrawPile(self, owner, {}))
            return cancel()
        }
    },
    false,  
), [], [addToDiscardPile])