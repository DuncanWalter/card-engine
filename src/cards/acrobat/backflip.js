import { MetaCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../actions/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../actions/damage';
import { DrawCards } from '../../actions/drawCards';


type BackflipData = { block: number, energy: number, draw: number }

export const backflip = 'backflip'
export const Backflip: Class<Card<BackflipData>> = MetaCard(backflip, playBackflip, {
    block: 5,
    energy: 1,
    draw: 2,
}, {
    energyTemplate: '#{energy}',
    color: '#223399',
    titleTemplate: 'Backflip',
    textTemplate: 'Gain #{block} block. Draw #{draw} cards.',
})

function* playBackflip({ actors, game, resolver }: PlayArgs<>): Generator<any, BackflipData, any> {
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
    yield resolver.processAction(new DrawCards(actors, game.player, {
        count: this.data.draw,
    }))
    return { block: action.data.stacks, energy: this.data.energy, draw: this.data.draw }

}