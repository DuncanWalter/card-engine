import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { CreatureWrapper } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { AddToDiscardPile } from '../../actions/addToDiscard';
import { Volatile } from '../../effects/volatile';

type AngerData = { damage: number, energy: number }

// TODO: make it etherial

export const anger = 'anger'
export const Anger: Class<Card<AngerData>> = MetaCard(anger, playAnger, {
    energy: 0,
    damage: 4,
}, {
    energyTemplate: '#{energy}',
    color: '#ee4422',
    titleTemplate: 'Anger',
    textTemplate: 'Deal #{damage} damage to an enemy. Add a copy of Anger to the discard pile. #[Volatile].',
}, [Volatile, 1])

function* playAnger({ resolver, actors }: PlayArgs<>): Generator<any, AngerData, any>{
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
        yield resolver.processAction(new AddToDiscardPile(this, this.clone(), {}))
        return { damage: action.data.damage, energy: this.data.energy }
    } else {
        return this.data
    }
}