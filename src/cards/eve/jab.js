import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { Discard } from '../../events/discard';
import { Singleton } from '../../effects/singleton';

type JabData = { damage: number, energy: number }

export const jab = 'jab'
export const Jab: () => Card<JabData> = defineCard(jab, playJab, {
    energy: 0,
    damage: 5,
}, {
    energyTemplate: '#{energy}',
    color: '#662222',
    titleTemplate: 'Jab',
    textTemplate: 'Deal #{damage} damage to an enemy. #[Singleton].',
}, [Singleton, 1])

function* playJab(self: Card<JabData>, { resolver, actors }: PlayArgs<>): Generator<any, JabData, any>{
    let target = yield queryEnemy(any => true)
    if(target && target instanceof Creature){
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
        return { damage: action.data.damage, energy: self.data.energy }
    } else {
        return self.data
    }
}