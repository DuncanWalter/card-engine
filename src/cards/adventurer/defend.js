import { MetaCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../actions/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted } from '../../actions/damage';


type DefendData = { block: number, energy: number }

export const defend = Symbol('defend')
export const Defend: Class<Card<DefendData>> = MetaCard(defend, playDefend, {
    block: 5,
    energy: 1,
}, {
    energyTemplate: (meta: DefendData) => meta.energy.toString(),
    color: '#223399',
    titleTemplate: (meta: DefendData) => 'Defend',
    textTemplate: (meta: DefendData) => <p>Gain {meta.block} block.</p>,
})

function* playDefend({ actor, resolver }: PlayArgs<>): Generator<any, DefendData, any> {
    if(actor instanceof Creature){
        const action: BindEffect = yield resolver.processAction(
            new BindEffect(
                this, 
                actor,
                {
                    Effect: Block,
                    stacks: this.data.block,
                },
                block,
                targeted,
            ),
        )
        return { block: action.data.stacks, energy: this.data.energy }
    } else {
        return this.data
    }
}