import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { DrawCards } from '../../events/drawCards'

type FlashOfSteelData = { damage: number, energy: number }

export const flashOfSteel = 'flashOfSteel'
export const FlashOfSteel: () => Card<FlashOfSteelData> = defineCard(flashOfSteel, playFlashOfSteel, {
    energy: 0,
    damage: 4,
}, {
    energyTemplate: '#{energy}',
    color: '#cccc44',
    titleTemplate: 'Flash Of Steel',
    textTemplate: 'Deal #{damage} damage. Draw a card.',
})

function* playFlashOfSteel(self: Card<FlashOfSteelData>, { resolver, actors, game }: PlayArgs): Generator<any, FlashOfSteelData, any>{
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
        yield resolver.processEvent(new DrawCards(actors, game.player, { count: 1 }))
        return { damage: action.data.damage, energy: self.data.energy }
    } else {
        return self.data
    }
}



