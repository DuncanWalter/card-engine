import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy, awaitAll, getEnemies } from './../utils'

type CleaveData = BasicCardData & { damage: number }

export const Cleave: () => Card<CleaveData> = defineCard('Cleave', playCleave, {
    energy: 1,
    damage: 7,
    playable: true,
}, {
    energyTemplate: '#{energy}',
    color: '#ee5511',
    titleTemplate: 'Cleave',
    textTemplate: 'Deal #{damage} damage to each enemy.',
})

function* playCleave(self: Card<CleaveData>, { resolver, game, actors, energy }: PlayArgs){
    // TODO: get nested simulations up so that aoe can list damages correctly    
    let actions = yield awaitAll(getEnemies().map(enemy =>
        resolver.processEvent(
            new Damage(
                actors,
                enemy,
                {
                    damage: self.data.damage,
                }, 
                blockable,
            ),
        )
    ))
    return {
        damage: actions[0].data.damage,
        energy,
    }
}