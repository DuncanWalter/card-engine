import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { CreatureWrapper } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { DrawCards } from '../../actions/drawCards';

type PalmStrikeData = { damage: number, energy: number, draw: number }

export const palmStrike = 'palmStrike'
export const PalmStrike: Class<Card<PalmStrikeData>> = MetaCard(palmStrike, playPalmStrike, {
    energy: 1,
    damage: 9,
    draw: 1,
}, {
    energyTemplate: '#{energy}',
    color: '#ee4422',
    titleTemplate: 'Palm Strike',
    textTemplate: 'Deal #{damage} damage to an enemy. Draw #{draw} cards.',
})

function* playPalmStrike({ resolver, actors }: PlayArgs<>): Generator<any, PalmStrikeData, any>{
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
        yield resolver.processAction(new DrawCards(actors, {}, { count: this.data.draw }))
        return { damage: action.data.damage, energy: this.data.energy, draw: this.data.draw }
    } else {
        return this.data
    }
}