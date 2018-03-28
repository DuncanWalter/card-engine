import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { Creature } from '../../creatures/creature'
import { queryTarget } from './../utils';
import { state as game } from '../../components/battle/battleState'

type StrikeData = { damage: number, energy: number }

export const strike = Symbol('strike')
export const Strike: Class<Card<StrikeData>> = MetaCard(strike, playStrike, {
    energy: 1,
    damage: 6,
}, {
    energyTemplate: (meta: StrikeData) => meta.energy.toString(),
    color: '#dd2244',
    titleTemplate: (meta: StrikeData) => 'Strike',
    textTemplate: (meta: StrikeData) => <p>Deal {meta.damage} damage to a target.</p>,
})

function* playStrike({ resolver }: PlayArgs<>): Generator<any, StrikeData, any>{
    let target = yield queryTarget(game.enemies, any => true)
    if(target && target instanceof Creature){
        const action: Damage = yield resolver.processAction(
            new Damage(
                this,
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