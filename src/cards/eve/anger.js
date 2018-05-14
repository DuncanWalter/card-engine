import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { AddToDiscardPile } from '../../actions/addToDiscard';
import { Volatile } from '../../effects/volatile';

type AngerData = { damage: number, energy: number }

// TODO: make it etherial

export const anger = 'anger'
export const Anger: () => Card<AngerData> = defineCard(anger, playAnger, {
    energy: 0,
    damage: 4,
}, {
    energyTemplate: '#{energy}',
    color: '#ee4422',
    titleTemplate: 'Anger',
    textTemplate: 'Deal #{damage} damage to an enemy. Add a copy of Anger to the discard pile. #[Volatile].',
}, [Volatile, 1])

function* playAnger(self, { resolver, actors }: PlayArgs<>): Generator<any, AngerData, any>{
    let target = yield queryEnemy(any => true)
    if(target && target instanceof Creature){
        const action: Damage = yield resolver.processAction(
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
        yield resolver.processAction(new AddToDiscardPile(self, self.clone(), {}))
        return { damage: action.data.damage, energy: self.data.energy }
    } else {
        return self.data
    }
}