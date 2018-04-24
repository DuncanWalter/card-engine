import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, damage, targeted, blockable } from './../../actions/damage'
import { Listener, ConsumerArgs } from '../../actions/listener'
import { BindEffect } from '../../actions/bindEffect'
import { Vulnerability } from '../../effects/vulnerability'
import { block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { Poison } from '../../effects/poison'
import { queryEnemy } from '../utils';

type AcidData = { 
    damage: number, 
    energy: number,
}

export const acid = 'acid'
export const Acid: Class<Card<AcidData>> = MetaCard(acid, playAcid, {
    damage: 4,
    energy: 1,
}, {
    energyTemplate: '#{energy}',
    color: '#eeff33',
    titleTemplate: 'Acid',
    textTemplate: 'Deal #{damage} damage to a target. Convert blocked damage to poison.',
})

function* playAcid({ resolver, actors }: PlayArgs<>): * {
    let target = yield queryEnemy(any => true)
    if(target instanceof Creature){
        const action: Damage = new Damage(
            actors, 
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
            function*({ internal, data, actors, subject, resolver, next }: ConsumerArgs<>): Generator<any, any, any> {
                const damage = data.damage
                yield internal()
                const poison = (damage - data.damage)
                yield next()
                yield resolver.processAction(new BindEffect(actors, subject, {
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
