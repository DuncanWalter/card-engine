import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { DrawCards } from '../../events/drawCards'
import { defineEffect } from '../../effects/effect'
import { BindEffect } from '../../events/bindEffect'
import { deafListener } from '../../events/listener'
import { Default } from '../../effects/default';

// TODO: make number of times played visible using the Rampage stacks effect

type RampageData = { damage: number, energy: number, scaling: number }

// TODO: Upgrades either increase scaling or provide Default

export const rampage = 'rampage'
export const Rampage: () => Card<RampageData> = defineCard(rampage, playRampage, {
    energy: 1,
    damage: 7,
    scaling: 5,
}, {
    energyTemplate: '#{energy}',
    color: '#ff9944',
    titleTemplate: 'Rampage',
    textTemplate: 'Deal #{damage} damage to an enemy. Deals #{scaling} more damage for each time this card has been played this combat.',
}, [Default, 1])

let RampageStacks = defineEffect('rampage', null, {
    stacked: true,
    delta: x => x,
    max: 999,
    min: 0,
}, (owner, self) => deafListener,  [], [])

function* playRampage(self: Card<RampageData>, { resolver, actors }: PlayArgs<>): Generator<any, RampageData, any>{
    let target = yield queryEnemy(any => true)
    if(target && target instanceof Creature){
        const action: Damage = yield resolver.processEvent(
            new Damage(
                actors,
                target,
                {
                    damage: self.data.damage + self.stacksOf('rampage') * self.data.scaling,
                },
                targeted,
                blockable,
            ),
        )
        yield resolver.processEvent(new BindEffect(actors, self, { 
            Effect: RampageStacks,
            stacks: 1,
        }))
        return { 
            damage: action.data.damage, 
            energy: self.data.energy, 
            scaling: self.data.scaling, 
        }
    } else {
        return self.data
    }
}