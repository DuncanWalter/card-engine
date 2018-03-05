import { MetaCard, Card, PlayArgs } from './card'
import { BindEffect } from '../actions/bindEffect'
import { block, Block } from '../effects/block'
import { Creature } from '../creatures/creature'


type DefendData = { block: number, energy: number }

export const defend = Symbol('defend')
export const Defend: Class<Card<DefendData>> = MetaCard(defend, playDefend, {
    block: 5,
    energy: 1,
}, {
    energyTemplate: (meta: DefendData) => meta.energy.toString(),
    color: '#223399',
    titleTemplate: (meta: DefendData) => 'Defend',
    textTemplate: (meta: DefendData) => `Gain ${meta.block} block`,
})

function playDefend({ actor, resolver }: PlayArgs<>): DefendData {
    if(actor instanceof Creature){
        const action: BindEffect = resolver.processAction(
            new BindEffect(
                this, 
                actor,
                {
                    Effect: Block,
                    stacks: this.data.block,
                },
                block,
            ),
        )
        return { block: action.data.stacks, energy: this.data.energy }
    } else {
        return this.data
    }
}