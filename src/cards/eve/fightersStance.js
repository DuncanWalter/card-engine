import { defineCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../events/damage';
import { AddToHand } from '../../events/addToHand';
import { Jab } from './jab';


type FightersStanceData = { block: number, energy: number, jabs: number }

export const fightersStance = 'fightersStance'
export const FightersStance: () => Card<FightersStanceData> = defineCard(fightersStance, playFightersStance, {
    block: 6,
    energy: 1,
    jabs: 1,
}, {
    energyTemplate: '#{energy}',
    color: '#551199',
    titleTemplate: 'Fighter\'s Stance',
    textTemplate: 'Gain #{block} block. Add #{jabs} copies of Jab to your hand.',
})

function* playFightersStance(self: Card<FightersStanceData>, { actors, game, resolver }: PlayArgs<>): Generator<any, FightersStanceData, any> {
    const action: BindEffect = yield resolver.processEvent(
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
    let i = self.data.jabs
    while(i-- > 0){
        yield resolver.processEvent(new AddToHand(actors, new Jab(), {}))
    }
    return { block: action.data.stacks, energy: self.data.energy, jabs: self.data.jabs }
}