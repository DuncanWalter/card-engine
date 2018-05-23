import { Creature } from "./creature"
import { state } from '../state'
import { Sequence } from "../utils/random";
import { Monster } from "./monster";
import { Player } from "./player";

export function pickTarget(self: Monster): Creature<> {
    if(state.battle.enemies.includes(self)){
        return new Player(state.battle.player)

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
        const enemies = state.battle.enemies
        return new Monster(enemies[Math.floor(self.seed.next() * enemies.length)])
    }
}



