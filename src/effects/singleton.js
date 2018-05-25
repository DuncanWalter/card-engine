import type { ListenerGroup, ConsumerArgs } from '../events/listener'
import { defineEffect, Effect, tick } from "./effect"
import { damage, Damage } from '../events/damage'
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from '../events/bindEffect'
import { playCard, PlayCard } from '../events/playCard'
import { Listener } from '../events/listener'
import { addToDiscardPile } from '../events/addToDiscardPile';
import { ExhaustCard } from '../events/exhaustCard';
import { Card } from "../cards/card";

export const singleton = 'singleton'
export const Singleton = defineEffect(singleton, {
    name: 'Singleton',
    innerColor: '#343434',
    outerColor: '#565656',
    description: 'On play, #[Destroy] instead of adding to discard.',
    sides: 30,
}, {
    stacked: false, 
    delta: x => x,
    min: 1,
    max: 1,
}, (owner, self) => new Listener(
    singleton,
    {
        subjects: [owner],
        type: addToDiscardPile,
        tags: [playCard],
    },
    function*({ game, data, resolver, cancel }: ConsumerArgs<>): * {
        if(owner instanceof Card){
            yield resolver.processEvent(new ExhaustCard(self, owner, {}))
            return cancel()
        }
    },
    false,  
), [], [addToDiscardPile])