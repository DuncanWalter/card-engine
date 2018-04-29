import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import { MetaEffect, Effect, tick } from "./effect"
import { damage, Damage } from "../actions/damage"
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from "../actions/bindEffect"
import { playCard, PlayCard } from "../actions/playCard"
import { Listener } from "../actions/listener"
import { addToDiscardPile } from "../actions/addToDiscard";
import { ExhaustCard } from "../actions/exhaustCard";
import { Card } from "../cards/card";

export const exhaust = Symbol('exhaust')
export const Exhaust: Class<Effect> = MetaEffect(exhaust, {
    name: 'Exhaust',
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
    exhaust,
    {
        subjects: [owner],
        type: addToDiscardPile,
        tags: [playCard],
    },
    function*({ game, data, resolver, cancel }: ConsumerArgs<>): * {
        if(owner instanceof Card){
            yield resolver.processAction(new ExhaustCard(self, owner, {}))
            return cancel()
        }
    },
    false,  
), [], [addToDiscardPile])