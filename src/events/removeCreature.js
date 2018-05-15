import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { EndCombat } from './endCombat'

export const removeCreature = Symbol('removeCreature')
export const RemoveCreature = defineEvent(removeCreature, function*({ game, actors, subject, resolver }){ 
    let index
    switch(true){
        case game.player.id == subject.id:{
            // rip
            resolver.pushEvents(new EndCombat(actors, subject, {}))
            break
        }
        case (index = subject.isIn(game.enemies)) >= 0:{
            // check if it all ends
            game.enemies.splice(index, 1)
            if(!game.enemies.length){
                resolver.pushEvents(new EndCombat(actors, subject, {}))
            }
            break
        }
        case (index = subject.isIn(game.allies)) >= 0:{
            // check if it all ends
            game.allies.splice(index, 1)
            break
        }
    }
})