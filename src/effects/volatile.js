import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import { MetaEffect, Effect, tick } from "./effect"
import { damage, Damage } from "../actions/damage"
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from "../actions/bindEffect"
import { playCard, PlayCard } from "../actions/playCard"
import { Listener } from "../actions/listener"
import { Player } from "../creatures/player"
import { endTurn } from "../actions/action"
import { ExhaustCard } from "../actions/exhaustCard"
import { Card } from "../cards/card";

export const volatile = Symbol('volatile')
export const Volatile: Class<Effect> = MetaEffect(volatile, {
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
            yield resolver.processAction(new ExhaustCard(actors, owner, { 
                from: game.hand,
            }))
        }
        data.destination = game.exhaustPile
    },
    false,  
), [], [endTurn])