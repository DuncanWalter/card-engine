import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { navigateTo } from '../utils/navigation'

export const endCombat = Symbol('endCombat')
export const EndCombat = defineEvent(endCombat, function*({ game, subject, resolver }){ 
    if(game.player.health > 0){

        game.player.inner.data.isActive = false

        game.player.effects.clear()

        navigateTo('/game/rewards')
    } else {
        navigateTo('/menu/main')
    }
})




