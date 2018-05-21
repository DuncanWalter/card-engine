import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { EndCombat } from './endCombat'

export const spawnCreature = 'spawnCreature'
export const SpawnCreature = defineEvent(spawnCreature, function*({ data, game, subject, resolver }){ 
    let index
    if(data.isAlly){
        game.allies.add(subject)
    } else {
        game.enemies.add(subject)
    }
})




