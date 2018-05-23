import type { ListenerGroup } from '../events/listener'
import { defineEffect, Effect } from "./effect"
import { damage, blockable } from '../events/damage'
import { vulnerability } from "./vulnerability"
import { BindEffect } from '../events/bindEffect'
import { Listener, ConsumerArgs } from '../events/listener'
import { block } from "./block";

export const redundancy = 'redundancy'
export const redundancyShatter = 'redundancyShatter'
// TODO: Make it reduce on hit when damage gets through
export const Redundancy = defineEffect(redundancy, {
    name: 'Redundancy',
    innerColor: '#6688ee',
    outerColor: '#2233bb',
    description: 'Reduce incoming damage. Reduces when taking damage.',
    sides: 5,
    rotation: 0.5,
}, {
    stacked: true,  
    delta: x => x,
    min: 1,
    max: 999,
}, (owner, self) => new Listener(
    redundancy,
    {
        subjects: [owner],
        tags: [blockable],
        type: damage,
    },
    function*({ data, resolver, actors, cancel }){
        if(typeof data.damage == 'number'){
            data.damage = Math.min(reducedDamage(data.damage, self.stacks))
        } else {
            throw new Error('Damage event has ill formated data')
        }
    },  
    false,
), [vulnerability], [block])

function reducedDamage(damage: number, armor: number): number {
    return Math.max(1, Math.floor(damage * damage / (damage + armor)))
}




