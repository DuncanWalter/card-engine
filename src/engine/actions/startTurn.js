import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import { EndTurn } from "./endTurn"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { DrawCard } from "./drawCard"

import type { CA } from "./action"


export const startTurn = Symbol('startTurn')
export const StartTurn: CA<any, any> = MetaAction(startTurn, ({ game, subject, resolver }: *) => { 
    if(subject instanceof Player){
        game.player.energy = game.player.maxEnergy

        resolver.enqueueActions(new DrawCard(game.player, {}, { count: 5 }))
        resolver.enqueueActions(...game.allies.map(ally => new StartTurn({}, ally, {})))
    } else if(subject instanceof NPC){
        if(game.enemies.indexOf(subject) >= 0){
            resolver.pushActions(...subject.createTurnActions(game), new EndTurn({}, subject, {}))
        }
    }
})