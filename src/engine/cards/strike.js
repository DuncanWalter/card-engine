import { MetaCard, Card, PlayArgs } from './card'
import { Damage, targeted } from './../actions/damage'
import { blockable } from '../effects/block'
import { Creature } from '../creatures/creature'

type StrikeData = { damage: number, energy: number }

export const strike = Symbol('strike')
export const Strike: Class<Card<StrikeData>> = MetaCard(strike, playStrike, {
    energy: 1,
    damage: 6,
}, {
    energyTemplate: (meta: StrikeData) => meta.energy.toString(),
    color: '#dd2244',
    titleTemplate: (meta: StrikeData) => 'Strike',
    textTemplate: (meta: StrikeData) => `Deal ${meta.damage} damage to a target.`,
}) 




function playStrike({ target, resolver }: PlayArgs<>): StrikeData{
    if(target instanceof Creature){
        const action: Damage = resolver.processAction(
            new Damage(
                this, 
                target,
                {
                    damage: this.data.damage,
                },
                targeted, 
                blockable,
            ),
        )
        return { damage: action.data.damage, energy: this.data.energy }
    } else {
        return this.data
    }
}