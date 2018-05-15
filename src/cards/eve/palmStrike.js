import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { DrawCards } from '../../events/drawCards';

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

function* playPalmStrike(self: Card<PalmStrikeData>, { game, resolver, actors }: PlayArgs<>): Generator<any, PalmStrikeData, any>{
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
        yield resolver.processEvent(new DrawCards(actors, game.player, { count: self.data.draw }))
        return { damage: action.data.damage, energy: self.data.energy, draw: self.data.draw }
    } else {
        return self.data
    }
}