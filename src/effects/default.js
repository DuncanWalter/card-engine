import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import { MetaEffect, Effect, tick } from "./effect"
import { damage, Damage } from "../actions/damage"
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from "../actions/bindEffect"
import { playCard, PlayCard } from "../actions/playCard"
import { Listener } from "../actions/listener"
import { addToDiscardPile } from "../actions/addToDiscard";
import { Card } from "../cards/card";
import { AddToDrawPile } from "../actions/addToDrawPile";

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
            yield resolver.processAction(new AddToDrawPile(self, owner, {}))
            return cancel()
        }
    },
    false,  
), [], [addToDiscardPile])