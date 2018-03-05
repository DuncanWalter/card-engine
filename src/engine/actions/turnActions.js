import { MetaAction, startTurn, endTurn } from "./action"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { DrawCard } from "./drawCard"

import type { CA } from "./action"

export { startTurn }
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

export { endTurn }
export const EndTurn: CA<any, Creature> = MetaAction(endTurn, ({ subject, resolver, game }: *) => {
    if(subject instanceof Player){
        // gameState.allies.reduce((acc, ally) => {
        //     acc.appendList(new LL(ally.takeTurn({ resolver, game: gameState })))
        //     return acc
        // }, new LL())

        while(game.hand.length){
            game.discardPile.push(game.hand.pop());
        }

        game.enemies.forEach(enemy => {
            resolver.enqueueActions(new StartTurn({}, enemy, {}))
        })
    } else if(subject instanceof NPC){
        const isEnemy = game.enemies.indexOf(subject) >= 0
        const noActiveEnemies = game.enemies.filter(enemy => !enemy.hasTakenTurn).length

        // check to see if all enemies have gone and the subject is an enemy
        // if so, start a player turn
        if(isEnemy && true/*noActiveEnemies*/){
            resolver.enqueueActions(new StartTurn({}, game.player, {}))
        }        
    }
})