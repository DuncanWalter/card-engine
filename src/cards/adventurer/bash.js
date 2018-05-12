import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, damage, targeted, blockable } from './../../actions/damage'
import { Listener } from '../../actions/listener'
import { BindEffect } from '../../actions/bindEffect'
import { Vulnerability } from '../../effects/vulnerability'
import { CreatureWrapper } from '../../creatures/creature'
import { queryEnemy } from '../utils'

type BashData = { damage: number, energy: number }

export const bash = 'bash'
export const Bash: Class<Card<BashData>> = MetaCard(bash, playBash, {
    damage: 8,
    energy: 2,
}, {
    energyTemplate: '#{energy}',
    color: '#bb4433',
    titleTemplate: 'Bash',
    textTemplate: `Deal #{damage} damage. #[Bloodied]: apply 2 #[vulnerability].`,
})


// TODO: the bash vulnerability should be a default listener on the damage action
function* playBash({ resolver, actors }: PlayArgs<>): Generator<any, BashData, any> {
    let target = yield queryEnemy(any => true)
    if(target instanceof CreatureWrapper){
        const action: Damage = yield resolver.processAction(
            new Damage(
                actors, 
                target,
                {
                    damage: this.data.damage,
                },
                targeted,
                blockable,
            ),
        )
        // TODO: should be an on damage listener?
        yield resolver.processAction(new BindEffect(this, target, {
            Effect: Vulnerability,
            stacks: 2,
        }, blockable))
        return { damage: action.data.damage, energy: this.data.energy }
    } else {
        return this.data
    }
}

