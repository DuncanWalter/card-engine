import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'

type CleaveData = { damage: number, energy: number }

export const Cleave: () => Card<CleaveData> = defineCard('Cleave', playCleave, {
    energy: 1,
    damage: 7,
}, {
    energyTemplate: '#{energy}',
    color: '#ee5511',
    titleTemplate: 'Cleave',
    textTemplate: 'Deal #{damage} damage to all enemies.',
})

function* playCleave(self: Card<CleaveData>, { resolver, game, actors }: PlayArgs<>){
    // TODO: get nested simulations up so that aoe can list damages correctly
    for(let promise of [...game.enemies].map(enemy =>
        resolver.processAction(
            new Damage(
                actors,
                enemy,
                {
                    damage: self.data.damage,
                }, 
                blockable,
            ),
        )
    )){
        yield promise
    }
    return self.data
}