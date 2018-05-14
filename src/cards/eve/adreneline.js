import { defineCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../actions/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../actions/damage'
import { AddToHand } from '../../actions/addToHand'
import { Jab } from './jab'
import { Singleton } from '../../effects/singleton'
import { DrawCards } from '../../actions/drawCards'
import { BindEnergy } from '../../actions/bindEnergy'

type AdrenalineData = { 
    draw: number, 
    energy: number,
    reEnergize: number, 
}

export const Adrenaline: () => Card<AdrenalineData> = defineCard('Adrenaline', playAdrenaline, {
    draw: 2,
    energy: 0,
    reEnergize: 1,
}, {
    energyTemplate: '#{energy}',
    color: '#99aa22',
    titleTemplate: 'Adrenaline',
    textTemplate: 'Gain #{reEnergize} energy. Draw #{draw} cards. #[Singleton].',
}, [Singleton, 1])

function* playAdrenaline(self: Card<AdrenalineData>, { actors, resolver, game }: PlayArgs<>){
    yield resolver.processAction(new DrawCards(actors, game.player, { count: self.data.draw }))
    yield resolver.processAction(new BindEnergy(actors, game.player, { quantity: self.data.reEnergize }))
    return self.data
}