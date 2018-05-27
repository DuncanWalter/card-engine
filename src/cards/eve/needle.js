import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { AddToDiscardPile } from '../../events/addToDiscardPile';
import { Volatile } from '../../effects/volatile';
import { Monster } from '../../creatures/monster';

type NeedleData = BasicCardData & { damage: number }

export const needle = 'needle'
export const Needle: () => Card<NeedleData> = defineCard(needle, playNeedle, {
    energy: 0,
    damage: 4,
}, {
    energyTemplate: '#{energy}',
    color: '#ee4422',
    titleTemplate: 'Needle',
    textTemplate: 'Deal #{damage} damage. Add a copy of Needle to the discard pile. #[Volatile].',
}, [Volatile, 1])

function* playNeedle(self, { resolver, actors, energy }: PlayArgs): Generator<any, NeedleData, any>{
    let target: Monster = yield queryEnemy()
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
    return { damage: action.data.damage, energy }
}
