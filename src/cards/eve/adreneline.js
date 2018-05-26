import { defineCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../events/damage'
import { AddToHand } from '../../events/addToHand'
import { Jab } from './jab'
import { Singleton } from '../../effects/singleton'
import { DrawCards } from '../../events/drawCards'
import { BindEnergy } from '../../events/bindEnergy'

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

function* playAdrenaline(self: Card<AdrenalineData>, { actors, resolver, game }: PlayArgs){
    yield resolver.processEvent(new DrawCards(actors, game.player, { 
        count: self.data.draw 
    }))
    yield resolver.processEvent(new BindEnergy(actors, game.player, { 
        quantity: self.data.reEnergize 
    }))
    return self.data
}