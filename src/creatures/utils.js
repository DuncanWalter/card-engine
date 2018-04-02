import { state as battle } from "../game/battle/battleState";
import { Creature } from "./creature"

function pickTarget(self){
    if(battle.enemies.includes(self)){
        return battle.player

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
        return battle.enemies[Math.floor(Math.random() * battle.enemies.length)]


    }
}