import { MetaCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../actions/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { dexterity, Dexterity } from '../../effects/dexterity'
import { Exhaust } from '../../effects/exhaust'


type FootworkData = { dexterity: number, energy: number }

export const footwork = 'footwork'
export const Footwork: Class<Card<FootworkData>> = MetaCard(footwork, playFootwork, {
    dexterity: 2,
    energy: 1,
}, {
    energyTemplate:'#{energy}',
    color: '#228866',
    titleTemplate: 'Footwork',
    textTemplate: 'Gain #{dexterity} dexterity',
}, [Exhaust, 1])

function* playFootwork({ actors, game, resolver }: PlayArgs<>): Generator<any, FootworkData, any> {
    // if(actor instanceof Creature){
    const action: BindEffect = yield resolver.processAction(
        new BindEffect(
            actors, 
            game.player,
            {
                Effect: Dexterity,
                stacks: this.data.dexterity,
            },
            dexterity,
        ),
    )
    return { dexterity: action.data.stacks, energy: this.data.energy }
    // } else {
    //     return this.data
    // }
}