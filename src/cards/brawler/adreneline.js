import { MetaCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../actions/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../actions/damage'
import { AddToHand } from '../../actions/addToHand'
import { Jab } from './jab'
import { Exhaust } from '../../effects/exhaust'
import { DrawCards } from '../../actions/drawCards'
import { BindEnergy } from '../../actions/bindEnergy'

type AdrenalineData = { 
    draw: number, 
    energy: number,
    reEnergize: number, 
}

export const adrenaline = 'adrenaline'
export const Adrenaline: Class<Card<AdrenalineData>> = MetaCard(adrenaline, playAdrenaline, {
    draw: 2,
    energy: 0,
    reEnergize: 1,
}, {
    energyTemplate: '#{energy}',
    color: '#99aa22',
    titleTemplate: 'Adrenaline',
    textTemplate: 'Gain #{reEnergize} energy. Draw #{draw} cards. #[Exhaust]',
}, [Exhaust, 1])

function* playAdrenaline({ actors, resolver, game }: PlayArgs<>): Generator<any, AdrenalineData, any> {
    yield resolver.processAction(new DrawCards(actors, game.player, { count: this.data.draw }))
    yield resolver.processAction(new BindEnergy(actors, game.player, { quantity: this.data.reEnergize }))
    return this.data
}