import type { ListenerGroup, ConsumerArgs } from "../actions/listener"
import { MetaEffect, Effect, tick } from "./effect"
import { damage, Damage } from "../actions/damage"
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from "../actions/bindEffect"
import { playCard, PlayCard } from "../actions/playCard"
import { Listener, deafListener } from "../actions/listener"
import { addToDiscardPile } from "../actions/addToDiscard";
import { Card } from "../cards/card";

export const taunt = Symbol('taunt')
export const Taunt: Class<Effect> = MetaEffect(taunt, {
    name: 'Taunt',
    innerColor: '#448811',
    outerColor: '#77dd22',
    description: '',
    sides: 5,
}, {
    stacked: true, 
    delta: x => x - 1,
    min: 1,
    max: 99,
}, (owner, self) => deafListener, [], [])