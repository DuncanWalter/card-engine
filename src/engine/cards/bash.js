import { MetaCard, Card, PlayArgs } from './card'
import { Damage, damage, targeted } from './../actions/damage'
import { Listener } from '../actions/listener'
import { BindEffect } from '../actions/bindEffect'
import { Vulnerability } from '../effects/vulnerability'
import { blockable } from '../effects/block'
import { Creature } from '../creatures/creature'
import { gameSlice } from '../gameState'

type BashData = { damage: number, energy: number }

export const bash = Symbol('bash')
export const Bash: Class<Card<BashData>> = MetaCard(bash, playBash, {
    damage: 8,
    energy: 2,
}, {
    energyTemplate: (meta: BashData) => meta.energy.toString(),
    color: '#bb4433',
    titleTemplate: (meta: BashData) => 'Bash',
    textTemplate: (meta: BashData) => `Deal ${meta.damage} damage and 1 weakness to a target.`,
})





function playBash({ target, resolver }: PlayArgs<>): BashData {
    if(target instanceof Creature){
        const action: Damage = resolver.processAction(
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
        resolver.processAction(new BindEffect(this, target, {
            Effect: Vulnerability,
            stacks: 2,
        }, blockable))
        return { damage: action.data.damage, energy: this.data.energy }
    } else {
        return this.data
    }
}

