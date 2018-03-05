import { MetaCard, Card, PlayArgs } from './card'
import { Damage, damage, targeted } from './../actions/damage'
import { Listener } from '../actions/actionResolver'
import { BindEffect } from '../actions/bindEffect'
import { Vulnerability } from '../effects/vulnerability'
import { blockable, block } from '../effects/block'
import { Creature } from '../creatures/creature'
import { gameSlice } from '../gameState'
import { Poison } from '../effects/poison';

type AcidData = { 
    damage: number, 
    energy: number,
}

export const acid = Symbol('acid')
export const Acid: Class<Card<AcidData>> = MetaCard(acid, playAcid, {
    damage: 4,
    energy: 1,
}, {
    energyTemplate: (meta: AcidData) => meta.energy.toString(),
    color: '#eeff33',
    titleTemplate: (meta: AcidData) => 'Acid',
    textTemplate: (meta: AcidData) => `Deal ${meta.damage} damage to a target. All blocked damage is converted to poison.`,
})

function playAcid({ target, resolver }: PlayArgs<>): AcidData {
    if(target instanceof Creature){
        const action: Damage = new Damage(
            this, 
            target,
            {
                damage: this.data.damage,
            },
            targeted,
            blockable,
        )
        action.defaultListeners.push({
            id: acid,
            header: {},
            consumer({ internal, data, actor, subject, resolver, next }){
                if(!resolver.simulating){
                    console.log(action, internal)
                }
                const damage = data.damage
                internal()
                const poison = (damage - data.damage)
                // console.log('ORIGINAL DAMAGE', damage, 'POISON STACKS', poison, data)
                next()
                resolver.processAction(new BindEffect(actor, subject, {
                    Effect: Poison,
                    stacks: poison,
                }, acid))
            },
            internal: block,
        })
        resolver.processAction(action)
        return { damage: action.data.damage, energy: this.data.energy }
    } else {
        return this.data
    }
}

// gameSlice.resolver.registerListenerType(acid, [], [])
