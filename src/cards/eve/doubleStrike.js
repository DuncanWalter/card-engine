import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'

type DoubleStrikeData = { damage: number, energy: number }

export const doubleStrike = 'doubleStrike'
export const DoubleStrike: () => Card<DoubleStrikeData> = defineCard(doubleStrike, playDoubleStrike, {
    energy: 1,
    damage: 5,
}, {
    energyTemplate: '#{energy}',
    color: '#dd4466',
    titleTemplate: 'Double Strike',
    textTemplate: 'Deal #{damage} damage to an enemy twice.',
})

function* playDoubleStrike(self: Card<DoubleStrikeData>, { resolver, actors }: PlayArgs<>): Generator<any, DoubleStrikeData, any>{
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
        yield resolver.processEvent(
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