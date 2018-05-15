import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { EndCombat } from './endCombat'

export const spawnCreature = Symbol('spawnCreature')
export const SpawnCreature = defineEvent(spawnCreature, function*({ data, game, subject, resolver }){ 
    let index
    if(data.isAlly){
        game.allies.push(subject)
    } else {
        game.enemies.push(subject)
    }
})




