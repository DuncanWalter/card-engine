import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { queryEnemy } from './../utils'
import { CreatureWrapper } from '../../creatures/creature';

type StrikeData = { damage: number, energy: number }

export const strike = 'strike'
export const Strike: Class<Card<StrikeData>> = MetaCard(strike, playStrike, {
    energy: 1,
    damage: 6,
}, {
    energyTemplate: '#{energy}',
    color: '#dd2244',
    titleTemplate: 'Strike',
    textTemplate: 'Deal #{damage} damage to an enemy.',
})

function* playStrike({ resolver, actors }: PlayArgs<>): Generator<any, StrikeData, any>{
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