import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'

type TripleStrikeData = { damage: number, energy: number }

export const tripleStrike = 'tripleStrike'
export const TripleStrike: () => Card<TripleStrikeData> = defineCard(tripleStrike, playTripleStrike, {
    energy: 1,
    damage: 4,
}, {
    energyTemplate: '#{energy}',
    color: '#dd6688',
    titleTemplate: 'Triple Strike',
    textTemplate: 'Deal #{damage} damage thrice.',
})

function* playTripleStrike(self: Card<TripleStrikeData>, { resolver, actors }: PlayArgs): Generator<any, TripleStrikeData, any>{
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