import { defineCard, Card, PlayArgs } from './../card'
import { Damage, damage, targeted, blockable } from './../../actions/damage'
import { Listener } from '../../actions/listener'
import { BindEffect } from '../../actions/bindEffect'
import { Vulnerability } from '../../effects/vulnerability'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from '../utils'

type CheapShotData = { damage: number, energy: number, vulnerability: number }

export const cheapShot = 'cheapShot'
export const CheapShot: () => Card<CheapShotData> = defineCard(cheapShot, playCheapShot, {
    damage: 8,
    energy: 1,
    vulnerability: 2,
}, {
    energyTemplate: '#{energy}',
    color: '#bb4433',
    titleTemplate: 'Cheap Shot',
    textTemplate: `Deal #{damage} damage. Apply #{vulnerability} vulnerability.`,
})

function* playCheapShot(self: Card<CheapShotData>, { resolver, actors }: PlayArgs<>): Generator<any, CheapShotData, any> {
    let target = yield queryEnemy(any => true)
    if(target instanceof Creature){
        const action: Damage = yield resolver.processAction(
            new Damage(
                actors, 
                target,
                {
                    damage: self.data.damage,
                },
                targeted,
                blockable,
            ),
        )
        const binding: BindEffect = yield resolver.processAction(new BindEffect(self, target, {
            Effect: Vulnerability,
            stacks: 2,
        }, blockable))
        return { damage: action.data.damage, energy: self.data.energy, vulnerability: binding.data.stacks }
    } else {
        return self.data
    }
}

