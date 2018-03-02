import { Card, CardPartial, PlayArgs } from './card'
import { BindEffect } from '../actions/bindEffect'
import { block } from '../effects/block'
import { Creature } from '../creatures/creature'


type Meta = { blk: string }

export const defend = Symbol('defend')
export class Defend extends CardPartial<Meta> implements Card<Meta> {
    
    id: Symbol = defend
    block: number

    constructor(){
        super()
        this.energyTemplate = (meta: Meta) => this.energy.toString()
        this.color = '#223399'
        this.titleTemplate = (meta: Meta) => 'Defend'
        this.textTemplate = (meta: Meta) => `Gain ${meta.blk} block`
        this.block = 5
        this.energy = 1
    }

    play({ resolver, actor, subject }: PlayArgs<>){
        if(subject instanceof Creature){
            const action: BindEffect = resolver.processAction(
                new BindEffect(
                    this, 
                    subject,
                    {
                        effect: block,
                        stacks: this.block,
                    },
                    block,
                ),
            )
            return { blk: action.data.stacks.toString() }
        } else {
            return { blk: this.block.toString() }
        }
    }
}