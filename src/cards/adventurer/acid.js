import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, damage, targeted, blockable } from './../../actions/damage'
import { Listener, ConsumerArgs } from '../../actions/listener'
import { BindEffect } from '../../actions/bindEffect'
import { Vulnerability } from '../../effects/vulnerability'
import { block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { Poison } from '../../effects/poison'
import { queryTarget } from '../utils';
import { state as game } from '../../game/battle/battleState';

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
    textTemplate: (meta: AcidData) => <p>Deal {meta.damage} damage to a target. Convert blocked damage to poison.</p>,
})

function* playAcid({ resolver }: PlayArgs<>): * {
    let target = yield queryTarget(game.enemies, any => true)
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
        action.defaultListeners.push(new Listener(
            block,
            {},
            function*({ internal, data, actor, subject, resolver, next }: ConsumerArgs<>): Generator<any, any, any> {
                const damage = data.damage
                yield internal()
                const poison = (damage - data.damage)
                yield next()
                yield resolver.processAction(new BindEffect(actor, subject, {
                    Effect: Poison,
                    stacks: poison,
                }, acid))
            },
            true,
        ))
        yield resolver.processAction(action)
        return { damage: action.data.damage, energy: this.data.energy }
    } else {
        return this.data
    }
}
