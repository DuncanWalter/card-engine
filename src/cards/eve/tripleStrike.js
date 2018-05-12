import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { CreatureWrapper } from '../../creatures/creature'
import { queryEnemy } from './../utils'

type TripleStrikeData = { damage: number, energy: number }

export const tripleStrike = 'tripleStrike'
export const TripleStrike: Class<Card<TripleStrikeData>> = MetaCard(tripleStrike, playTripleStrike, {
    energy: 1,
    damage: 4,
}, {
    energyTemplate: '#{energy}',
    color: '#dd6688',
    titleTemplate: 'Triple Strike',
    textTemplate: 'Deal #{damage} damage to an enemy thrice.',
})

function* playTripleStrike({ resolver, actors }: PlayArgs<>): Generator<any, TripleStrikeData, any>{
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