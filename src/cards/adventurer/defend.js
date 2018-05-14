import { defineCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../actions/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../actions/damage';

type DefendData = { block: number, energy: number }

export const Defend: () => Card<DefendData> = defineCard('Defend', playDefend, {
    block: 5,
    energy: 1,
}, {
    energyTemplate: '#{energy}',
    color: '#223399',
    titleTemplate: 'Defend',
    textTemplate: 'Gain #{block} block.',
})

function* playDefend(self: Card<DefendData>, { actors, game, resolver }: PlayArgs<>) {
    const action: BindEffect = yield resolver.processAction(
        new BindEffect(
            actors, 
            game.player,
            {
                Effect: Block,
                stacks: self.data.block,
            },
            block,
            targeted,
        ),
    )
    return { block: action.data.stacks, energy: self.data.energy }
}