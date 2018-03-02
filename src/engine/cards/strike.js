import { Card, CardPartial, PlayArgs } from './card'
import { Damage, targeted } from './../actions/damage'
import { blockable } from '../effects/block'
import { Creature } from '../creatures/creature'

type Meta = { dmg: string }

export const strike = Symbol('strike')
export class Strike extends CardPartial<Meta> implements Card<Meta> {
    
    id: Symbol = strike
    damage: number

    constructor(){
        super()
        this.energyTemplate = (meta: Meta) => this.energy.toString()
        this.color = '#993322'
        this.titleTemplate = (meta: Meta) => 'Strike'
        this.textTemplate = (meta: Meta) => `Deal ${meta.dmg} damage to one target`
        this.damage = 6
        this.energy = 1
    }

    play({ resolver, actor, subject }: PlayArgs<>): Meta {
        if(subject instanceof Creature){
            const action: Damage = resolver.processAction(
                new Damage(
                    this, 
                    subject,
                    {
                        damage: this.damage,
                    },
                    targeted, 
                    blockable,
                ),
            )
            return { dmg: action.data.damage.toString() }
        } else {
            return { dmg: this.damage.toString() }
        }
    }
}