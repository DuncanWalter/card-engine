import { defineCard, Card, PlayArgs, CardState } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { queryEnemy } from './../utils'
import { Creature } from '../../creatures/creature'

type StrikeData = { damage: number, energy: number }

export const Strike: () => Card<StrikeData> = defineCard('Strike', playStrike, {
    energy: 1,
    damage: 6,
}, {
    energyTemplate: '#{energy}',
    color: '#dd2244',
    titleTemplate: 'Strike',
    textTemplate: 'Deal #{damage} damage to an enemy.',
})

function* playStrike(self: Card<StrikeData>, { resolver, actors }: PlayArgs<>) {
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
        return { damage: action.data.damage, energy: self.data.energy }
    } else {
        return self.data
    }
}