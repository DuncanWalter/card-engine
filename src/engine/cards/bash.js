import { Card, CardPartial, PlayArgs } from './card'
import { Damage, damage, targeted } from './../actions/damage'
import { Listener } from '../actions/actionResolver'
import { BindEffect } from '../actions/bindEffect'
import { vulnerable } from '../effects/vulnerable'
import { blockable } from '../effects/block'
import { Creature } from '../creatures/creature'

type Meta = { dmg: string }

export const bash = Symbol('bash')
export class Bash extends CardPartial<Meta> implements Card<Meta> {
    
    id: Symbol = bash
    damage: number

    constructor(){
        super()
        this.energyTemplate = (meta: Meta) => '1'
        this.color = '#bb4433'
        this.titleTemplate = (meta: Meta) => 'Bash'
        this.textTemplate = (meta: Meta) => `Deal ${meta.dmg} damage and 1 weakness to one target`
        this.damage = 5
        this.listener = {
            id: bash,
            header: {
                actors: [this],
                tags: [damage],
            },
            consumer({ resolver, subject }){
                resolver.processAction(new BindEffect(this.owner, subject, {
                    effect: vulnerable, 
                    stacks: 2,
                }))
            },
        }
    }

    play({ actor, subject, resolver }: PlayArgs<>): Meta {
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
