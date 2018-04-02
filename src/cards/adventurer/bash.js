import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, damage, targeted, blockable } from './../../actions/damage'
import { Listener } from '../../actions/listener'
import { BindEffect } from '../../actions/bindEffect'
import { Vulnerability } from '../../effects/vulnerability'
import { Creature } from '../../creatures/creature'
import { state as game } from '../../game/battle/battleState'
import { queryTarget } from '../utils'

type BashData = { damage: number, energy: number }

export const bash = Symbol('bash')
export const Bash: Class<Card<BashData>> = MetaCard(bash, playBash, {
    damage: 8,
    energy: 2,
}, {
    energyTemplate: (meta: BashData) => meta.energy.toString(),
    color: '#bb4433',
    titleTemplate: (meta: BashData) => 'Bash',
    textTemplate: (meta: BashData) => <p>Deal {meta.damage} damage and 1 weakness to a target.</p>,
})




// TODO: the bash vulnerability should be a default listener on the damage action
function* playBash({ resolver }: PlayArgs<>): Generator<any, BashData, any> {
    let target = yield queryTarget(game.enemies, any => true)
    if(target instanceof Creature){
        const action: Damage = yield resolver.processAction(
            new Damage(
                this, 
                target,
                {
                    damage: this.data.damage,
                },
                targeted,
                blockable,
            ),
        )
        yield resolver.processAction(new BindEffect(this, target, {
            Effect: Vulnerability,
            stacks: 2,
        }, blockable))
        return { damage: action.data.damage, energy: this.data.energy }
    } else {
        return this.data
    }
}

