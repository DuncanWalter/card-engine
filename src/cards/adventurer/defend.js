import { MetaCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../actions/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../actions/damage';


type DefendData = { block: number, energy: number }

export const defend = 'defend'
export const Defend: Class<Card<DefendData>> = MetaCard(defend, playDefend, {
    block: 5,
    energy: 1,
}, {
    energyTemplate: '#{energy}',
    color: '#223399',
    titleTemplate: 'Defend',
    textTemplate: 'Gain #{block} block.',
})

function* playDefend({ actors, game, resolver }: PlayArgs<>): Generator<any, DefendData, any> {
    // if(game instanceof Creature){
    const action: BindEffect = yield resolver.processAction(
        new BindEffect(
            actors, 
            game.player,
            {
                Effect: Block,
                stacks: this.data.block,
            },
            block,
            targeted,
        ),
    )
    return { block: action.data.stacks, energy: this.data.energy }
    // } else {
    //     return this.data
    // }
}