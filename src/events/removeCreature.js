import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { EndCombat } from './endCombat'
import { ConsumerArgs } from './listener';

type Type = {
    subject: Creature<>,
    data: any,
}

export const RemoveCreature = defineEvent('removeCreature', function*({ game, actors, subject, resolver }: ConsumerArgs<Type>){ 
    let index
    switch(true){
        case game.player.id == subject.id:{
            // rip
            resolver.pushEvents(new EndCombat(actors, subject, {}))
            break
        }
        case game.enemies.includes(subject):{
            // check if it all ends
            game.enemies.remove(subject)
            if(!game.enemies.size){
                resolver.pushEvents(new EndCombat(actors, subject, {}))
            }
            break
        }
        case game.allies.includes(subject):{
            game.allies.remove(subject)
            break
        }
    }
})