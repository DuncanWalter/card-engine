import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { DrawCards } from '../../actions/drawCards'
import { vulnerability } from '../../effects/vulnerability'
import { latency } from '../../effects/latency'
import { BindEnergy } from '../../actions/bindEnergy'

type LegReapData = { damage: number, energy: number }

export const legReap = 'legReap'
export const LegReap: () => Card<LegReapData> = defineCard(legReap, playLegReap, {
    energy: 1,
    damage: 8,
}, {
    energyTemplate: '#{energy}',
    color: '#ee4422',
    titleTemplate: 'Leg Reap',
    textTemplate: 'Deal #{damage} damage to an enemy. If that opponent has weakness, gain 1 energy. If that opponent has vulnerability, draw 1 card.',
})

function* playLegReap(self: Card<LegReapData>, { resolver, actors, game }: PlayArgs<>): Generator<any, LegReapData, any>{
    let target = yield queryEnemy(any => true)
    if(target && target instanceof Creature){
        const action: Damage = yield resolver.processAction(
            new Damage(
                actors,
                target,
                {
                    damage: self.data.damage,
                },
                targeted, 
                blockable,
            ),
        )
        if(target.stacksOf(latency)){
            yield resolver.processAction(new BindEnergy(actors, game.player, { quantity: 1 }))
        }
        if(target.stacksOf(vulnerability)){
            yield resolver.processAction(new DrawCards(actors, game.player, { count: 1 }))
        }
        return { damage: action.data.damage, energy: self.data.energy }
    } else {
        return self.data
    }
}