import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'

type DoubleStrikeData = { damage: number, energy: number }

export const doubleStrike = 'doubleStrike'
export const DoubleStrike: Class<Card<DoubleStrikeData>> = MetaCard(doubleStrike, playDoubleStrike, {
    energy: 1,
    damage: 5,
}, {
    energyTemplate: '#{energy}',
    color: '#dd4466',
    titleTemplate: 'Double Strike',
    textTemplate: 'Deal #{damage} damage to an enemy twice.',
})

function* playDoubleStrike({ resolver, actors }: PlayArgs<>): Generator<any, DoubleStrikeData, any>{
    let target = yield queryEnemy(any => true)
    if(target && target instanceof Creature){
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
        yield resolver.processAction(
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