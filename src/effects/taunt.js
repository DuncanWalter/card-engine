import type { ListenerGroup, ConsumerArgs } from '../events/listener'
import { MetaEffect, Effect, tick } from "./effect"
import { damage, Damage } from '../events/damage'
import { vulnerability } from "./vulnerability"
import { BindEffect, bindEffect } from '../events/bindEffect'
import { playCard, PlayCard } from '../events/playCard'
import { Listener, deafListener } from '../events/listener'
import { addToDiscardPile } from '../events/addToDiscard';
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