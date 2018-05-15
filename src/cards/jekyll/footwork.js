import { defineCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { dexterity, Dexterity } from '../../effects/dexterity'
import { Singleton } from '../../effects/singleton'

type FootworkData = { dexterity: number, energy: number }

export const footwork = 'footwork'
export const Footwork: () => Card<FootworkData> = defineCard(footwork, playFootwork, {
    dexterity: 2,
    energy: 1,
}, {
    energyTemplate:'#{energy}',
    color: '#228866',
    titleTemplate: 'Footwork',
    textTemplate: 'Gain #{dexterity} dexterity. #[Singleton]',
}, [Singleton, 1])

function* playFootwork(self: Card<FootworkData>, { actors, game, resolver }: PlayArgs<>): Generator<any, FootworkData, any> {
    const action: BindEffect = yield resolver.processEvent(
        new BindEffect(
            actors, 
            game.player,
            {
                Effect: Dexterity,
                stacks: self.data.dexterity,
            },
            dexterity,
        ),
    )
    return { dexterity: action.data.stacks, energy: self.data.energy }
}