import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { DrawCards } from '../../actions/drawCards';

type PalmStrikeData = { damage: number, energy: number, draw: number }

export const palmStrike = 'palmStrike'
export const PalmStrike: () => Card<PalmStrikeData> = defineCard(palmStrike, playPalmStrike, {
    energy: 1,
    damage: 9,
    draw: 1,
}, {
    energyTemplate: '#{energy}',
    color: '#ee4422',
    titleTemplate: 'Palm Strike',
    textTemplate: 'Deal #{damage} damage to an enemy. Draw #{draw} cards.',
})

function* playPalmStrike(self: Card<PalmStrikeData>, { resolver, actors }: PlayArgs<>): Generator<any, PalmStrikeData, any>{
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
        yield resolver.processAction(new DrawCards(actors, {}, { count: self.data.draw }))
        return { damage: action.data.damage, energy: self.data.energy, draw: self.data.draw }
    } else {
        return self.data
    }
}