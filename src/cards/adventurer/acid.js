import { defineCard, Card, PlayArgs } from './../card'
import { Damage, damage, targeted, blockable } from './../../events/damage'
import { Listener, ConsumerArgs } from '../../events/listener'
import { BindEffect } from '../../events/bindEffect'
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
export const Acid: () => Card<AcidData> = defineCard(acid, playAcid, {
    damage: 4,
    energy: 1,
}, {
    energyTemplate: '#{energy}',
    color: '#eeff33',
    titleTemplate: 'Acid',
    textTemplate: 'Deal #{damage} damage to a target. Convert blocked damage to poison.',
})

function* playAcid(self: Card<AcidData>, { resolver, actors }: PlayArgs<>){
    let target = yield queryEnemy(any => true)
    if(target instanceof Creature){
        const action: Damage = new Damage(
            actors, 
            target,
            {
                damage: self.data.damage,
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
                yield resolver.processEvent(new BindEffect(actors, subject, {
                    Effect: Poison,
                    stacks: poison,
                }))
            },
            true,
        ))
        yield resolver.processEvent(action)
        return { damage: action.data.damage, energy: self.data.energy }
    } else {
        return self.data
    }
}
