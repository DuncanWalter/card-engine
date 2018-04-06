import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'

type CleaveData = { damage: number, energy: number }

export const cleave = Symbol('cleave')
export const Cleave: Class<Card<CleaveData>> = MetaCard(cleave, playCleave, {
    energy: 1,
    damage: 7,
}, {
    energyTemplate: (meta: CleaveData) => meta.energy.toString(),
    color: '#ee5511',
    titleTemplate: (meta: CleaveData) => 'cleave',
    textTemplate: (meta: CleaveData) => <p>Deal {meta.damage} damage to all enemies.</p>,
})

function* playCleave({ resolver, game }: PlayArgs<>): Generator<any, CleaveData, any>{

    // TODO: get nested simulations up so that aoe can list damages correctly

    for(let promise of [...game.enemies].map(enemy =>
        resolver.processAction(
            new Damage(
                this,
                enemy,
                {
                    damage: this.data.damage,
                }, 
                blockable,
            ),
        )
    )){
        yield promise
    }
    return this.data
}