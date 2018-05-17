import type { ListenerGroup, ConsumerArgs } from '../events/listener'
import { defineEffect, Effect, tick } from "./effect"
import { damage, Damage } from '../events/damage'
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from '../events/bindEffect'
import { playCard, PlayCard } from '../events/playCard'
import { Listener } from '../events/listener'
import { Player } from "../creatures/player"
import { endTurn } from '../events/event'
import { ExhaustCard } from '../events/exhaustCard'
import { Card } from "../cards/card";

export const volatile = Symbol('volatile')
export const Volatile = defineEffect(volatile, {
    name: 'Volatile',
    innerColor: '#343467',
    outerColor: '#56569a',
    description: '',
    sides: 30,
}, {
    stacked: false, 
    delta: x => x,
    min: 1,
    max: 1,
}, (owner, self) => new Listener(
    volatile,
    {
        // TODO: trigger on turn end discards
        filter: action => action.subject instanceof Player,
        type: endTurn,
    },
    function*({ actors, game, data, resolver }: ConsumerArgs<>): * {
        if(owner instanceof Card && game.hand.has(owner)){
            yield resolver.processEvent(new ExhaustCard(actors, owner, { 
                from: game.hand,
            }))
        }
        data.destination = game.exhaustPile
    },
    false,  
), [], [endTurn])