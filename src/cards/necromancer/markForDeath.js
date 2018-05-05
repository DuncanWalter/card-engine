import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { BindEffect } from '../../actions/bindEffect';
import { Vulnerability } from '../../effects/vulnerability';
import { Taunt } from '../../effects/taunt';

type MarkForDeathData = { taunt: number, energy: number, vulnerability: number }

export const markForDeath = 'markForDeath'
export const MarkForDeath: Class<Card<MarkForDeathData>> = MetaCard(markForDeath, playMarkForDeath, {
    taunt: 1,
    vulnerability: 1,
    energy: 0,
}, {
    energyTemplate: '#{energy}',
    color: '#dd2244',
    titleTemplate: 'MarkForDeath',
    textTemplate: 'Apply #{taunt} #[taunt] and #{vulnerability} #[vulnerability].',
})

function* playMarkForDeath({ resolver, actors }: PlayArgs<>): Generator<any, MarkForDeathData, any>{
    // TODO: query creature
    let target = yield queryEnemy(any => true)
    yield resolver.processAction(new BindEffect(actors, target, {
        Effect: Taunt,
        stacks: this.data.taunt,
    }))
    yield resolver.processAction(new BindEffect(actors, target, {
        Effect: Vulnerability,
        stacks: this.data.vulnerability,
    }))
    return {
        taunt: this.data.taunt, 
        vulnerability: this.data.vulnerability, 
        energy: this.data.energy,
    }
}