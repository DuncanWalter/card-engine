import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { BindEffect } from '../../events/bindEffect';
import { Vulnerability } from '../../effects/vulnerability';
import { Taunt } from '../../effects/taunt';

type MarkForDeathData = { taunt: number, energy: number, vulnerability: number }

export const markForDeath = 'markForDeath'
export const MarkForDeath: () => Card<MarkForDeathData> = defineCard(markForDeath, playMarkForDeath, {
    taunt: 1,
    vulnerability: 1,
    energy: 0,
}, {
    energyTemplate: '#{energy}',
    color: '#dd2244',
    titleTemplate: 'MarkForDeath',
    textTemplate: 'Apply #{taunt} #[taunt] and #{vulnerability} #[vulnerability].',
})

function* playMarkForDeath(self: Card<MarkForDeathData>, { resolver, actors }: PlayArgs<>): Generator<any, MarkForDeathData, any>{
    // TODO: query creature
    let target = yield queryEnemy(any => true)
    yield resolver.processEvent(new BindEffect(actors, target, {
        Effect: Taunt,
        stacks: self.data.taunt,
    }))
    yield resolver.processEvent(new BindEffect(actors, target, {
        Effect: Vulnerability,
        stacks: self.data.vulnerability,
    }))
    return {
        taunt: self.data.taunt, 
        vulnerability: self.data.vulnerability, 
        energy: self.data.energy,
    }
}