
import { MetaAction, Action } from './action'

import type { CustomAction } from '../actions/action'
import type { Creature } from '../creatures/creature'


export const removeCreature = Symbol('removeCreature')
export const RemoveCreature: CustomAction<any, Creature> = MetaAction(removeCreature, ({ game, subject, resolver }: *) => { 
    let index
    switch(true){
        case game.player == subject:{
            // rip
            // resolver.pushActions(new Defeat())
        }
        case (index = game.enemies.indexOf(subject)) >= 0:{
            // check if it all ends
            game.enemies.splice(index, 1)
            if(!game.enemies.length){
                // resolver.pushActions(new Victory())
            }
        }
        case (index = game.allies.indexOf(subject)) >= 0:{
            // check if it all ends
            game.allies.splice(index, 1)
        }
    }
})




