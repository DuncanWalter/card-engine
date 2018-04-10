import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { DrawCard } from '../../actions/drawCard'

type FlashOfSteelData = { damage: number, energy: number }

export const flashOfSteel = Symbol('flashOfSteel')
export const FlashOfSteel: Class<Card<FlashOfSteelData>> = MetaCard(flashOfSteel, playFlashOfSteel, {
    energy: 0,
    damage: 4,
}, {
    energyTemplate: (meta: FlashOfSteelData) => meta.energy.toString(),
    color: '#cccc44',
    titleTemplate: (meta: FlashOfSteelData) => 'FlashOfSteel',
    textTemplate: (meta: FlashOfSteelData) => <p>Deal {meta.damage} damage to a target. Draw a card.</p>,
})

function* playFlashOfSteel({ resolver }: PlayArgs<>): Generator<any, FlashOfSteelData, any>{
    let target = yield queryEnemy(any => true)
    if(target && target instanceof Creature){
        const action: Damage = yield resolver.processAction(
            new Damage(
                this,
                target,
                {
                    damage: this.data.damage,
                },
                targeted, 
                blockable,
            ),
        )
        yield resolver.processAction(new DrawCard({}, {}, { count: 1 }))
        return { damage: action.data.damage, energy: this.data.energy }
    } else {
        return this.data
    }
}



