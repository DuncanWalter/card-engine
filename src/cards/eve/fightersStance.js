import { MetaCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../actions/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../actions/damage';
import { AddToHand } from '../../actions/addToHand';
import { Jab } from './jab';


type FightersStanceData = { block: number, energy: number }

export const fightersStance = 'fightersStance'
export const FightersStance: Class<Card<FightersStanceData>> = MetaCard(fightersStance, playFightersStance, {
    block: 6,
    energy: 1,
    jabs: 1,
}, {
    energyTemplate: '#{energy}',
    color: '#551199',
    titleTemplate: 'Fighter\'s Stance',
    textTemplate: 'Gain #{block} block. Add #{jabs} copies of Jab to your hand.',
})

function* playFightersStance({ actors, game, resolver }: PlayArgs<>): Generator<any, FightersStanceData, any> {
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
    let i = this.data.jabs
    while(i-- > 0){
        yield resolver.processAction(new AddToHand(actors, new Jab(), {}))
    }
    return { block: action.data.stacks, energy: this.data.energy }
}