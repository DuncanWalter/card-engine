import { MetaAction, Action } from './action'

import type { CustomAction } from '../actions/action'
import type { Creature } from '../creatures/creature'

import { navigateTo } from '../utils/navigation'

export const endCombat = Symbol('endCombat')
export const EndCombat: CustomAction<> = MetaAction(endCombat, ({ game, subject, resolver }: *) => { 
    if(game.player.health > 0){

        game.player.effects.splice(0,  game.player.effects.length)

        navigateTo('/game/pathSelection')
    } else {
        navigateTo('/menu/main')
    }
})




