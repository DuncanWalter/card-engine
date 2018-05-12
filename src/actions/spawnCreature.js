import type { CustomAction } from '../actions/action'
import type { Creature } from '../creatures/creature'

import { MetaAction, Action } from './action'
import { EndCombat } from './endCombat'
import { CreatureWrapper } from '../creatures/creature';

export const spawnCreature = Symbol('spawnCreature')
export const SpawnCreature: CustomAction<{ isAlly: boolean }, CreatureWrapper<>> = MetaAction(spawnCreature, ({ data, game, subject, resolver }: *): void => { 
    let index
    if(data.isAlly){
        game.allies.push(subject)
    } else {
        game.enemies.push(subject)
    }
})




