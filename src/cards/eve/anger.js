import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { AddToDiscardPile } from '../../events/addToDiscardPile';
import { Volatile } from '../../effects/volatile';
import { Monster } from '../../creatures/monster';

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
    let target: Monster = yield queryEnemy(any => true)
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
    yield resolver.processEvent(new AddToDiscardPile(self, self.clone(), {}))
    return { damage: action.data.damage, energy: self.data.energy }
}
