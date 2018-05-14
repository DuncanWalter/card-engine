import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { DrawCards } from '../../actions/drawCards'

type FlashOfSteelData = { damage: number, energy: number }

export const flashOfSteel = 'flashOfSteel'
export const FlashOfSteel: () => Card<FlashOfSteelData> = defineCard(flashOfSteel, playFlashOfSteel, {
    energy: 0,
    damage: 4,
}, {
    energyTemplate: '#{energy}',
    color: '#cccc44',
    titleTemplate: 'Flash Of Steel',
    textTemplate: 'Deal #{damage} damage to a target. Draw a card.',
})

function* playFlashOfSteel(self: Card<FlashOfSteelData>, { resolver, actors }: PlayArgs<>): Generator<any, FlashOfSteelData, any>{
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
        yield resolver.processAction(new DrawCards({}, {}, { count: 1 }))
        return { damage: action.data.damage, energy: self.data.energy }
    } else {
        return self.data
    }
}



