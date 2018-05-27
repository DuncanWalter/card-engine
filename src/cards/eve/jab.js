import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { Discard } from '../../events/discard';
import { Singleton } from '../../effects/singleton';

type JabData = BasicCardData & { damage: number }

export const jab = 'jab'
export const Jab: () => Card<JabData> = defineCard(jab, playJab, {
    energy: 0,
    damage: 5,
}, {
    energyTemplate: '#{energy}',
    color: '#662222',
    titleTemplate: 'Jab',
    textTemplate: 'Deal #{damage} damage. #[Singleton].',
}, [Singleton, 1])

function* playJab(self: Card<JabData>, { resolver, actors, energy }: PlayArgs): Generator<any, JabData, any>{
    let target = yield queryEnemy()
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
    return { damage: action.data.damage, energy }
}