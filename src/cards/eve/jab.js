import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { CreatureWrapper } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { Discard } from '../../actions/discard';
import { Singleton } from '../../effects/singleton';

type JabData = { damage: number, energy: number }

export const jab = 'jab'
export const Jab: Class<Card<JabData>> = MetaCard(jab, playJab, {
    energy: 0,
    damage: 5,
}, {
    energyTemplate: '#{energy}',
    color: '#662222',
    titleTemplate: 'Jab',
    textTemplate: 'Deal #{damage} damage to an enemy. #[Singleton].',
}, [Singleton, 1])

function* playJab({ resolver, actors }: PlayArgs<>): Generator<any, JabData, any>{
    let target = yield queryEnemy(any => true)
    if(target && target instanceof CreatureWrapper){
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
        return { damage: action.data.damage, energy: this.data.energy }
    } else {
        return this.data
    }
}