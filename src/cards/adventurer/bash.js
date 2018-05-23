import { defineCard, Card, PlayArgs } from './../card'
import { Damage, damage, targeted, blockable } from './../../events/damage'
import { Listener } from '../../events/listener'
import { BindEffect } from '../../events/bindEffect'
import { Vulnerability } from '../../effects/vulnerability'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from '../utils'

type BashData = { damage: number, energy: number }

export const bash = 'bash'
export const Bash: () => Card<BashData> = defineCard(bash, playBash, {
    damage: 8,
    energy: 2,
}, {
    energyTemplate: '#{energy}',
    color: '#bb4433',
    titleTemplate: 'Bash',
    textTemplate: `Deal #{damage} damage. #[On Damage]: apply 2 #[vulnerability].`,
})


// TODO: the bash vulnerability should be a default listener on the damage action
function* playBash(self: Card<BashData>, { resolver, actors }: PlayArgs){
    let target = yield queryEnemy(any => true)
    if(target instanceof Creature){
        const action: Damage = yield resolver.processEvent(
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
        // TODO: should be an on damage listener?
        yield resolver.processEvent(new BindEffect(self, target, {
            Effect: Vulnerability,
            stacks: 2,
        }, blockable))
        return { damage: action.data.damage, energy: self.data.energy }
    } else {
        return self.data
    }
}

