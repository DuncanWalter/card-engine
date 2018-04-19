import { Creature } from "./creature"
import { state } from '../state'

// TODO: add and random thingy
function pickTarget(self){
    if(state.battle.enemies.includes(self)){
        return state.battle.player

        // TODO: taunt and phantom

        // let priorityTargets = battle.allies.filter(ally => 
        //     ally.effects.filter(effect => 
        //         effect.id == 'taunt'
        //     ).length
        // )
        // if(battle.player.effects.filter(effect => 
        //     effect.id == 'taunt'
        // ).length || !priorityTargets.length){
        //     return battle.player
        // }
    } else {
        // TODO: psuedorandom
        return state.battle.enemies[Math.floor(Math.random() * state.battle.enemies.length)]


    }
}



