import type { CustomAction } from './action'
import { MetaAction, startTurn, endTurn } from "./action"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { DrawCard } from "./drawCard"
import { TakeTurn } from "./takeTurn";

export { startTurn }
export const StartTurn: CustomAction<> = MetaAction(startTurn, function*({ game, subject, resolver }):*{ 
    if(subject instanceof Player){
        game.player.energy = game.player.maxEnergy

        resolver.enqueueActions(new DrawCard(game.player, {}, { count: 5 }, startTurn))
        resolver.enqueueActions(...game.allies.map(ally => new StartTurn({}, ally, {})))
    } else if(subject instanceof NPC){
        if(game.enemies.indexOf(subject) >= 0){
            resolver.pushActions(
                new TakeTurn({}, subject, {}), 
                new EndTurn({}, subject, {}),
            )
        }
    }
})

export { endTurn }
export const EndTurn: CustomAction<any, Creature> = MetaAction(endTurn, ({ subject, resolver, game }: *) => {
    if(subject instanceof Player){
        // gameState.allies.reduce((acc, ally) => {
        //     acc.appendList(new LL(ally.takeTurn({ resolver, game: gameState })))
        //     return acc
        // }, new LL())

        while(game.hand.length){
            game.discardPile.push(game.hand.pop());
        }

        game.enemies.forEach(enemy => {
            enemy.hasTakenTurn = false
            resolver.enqueueActions(new StartTurn({}, enemy, {}))
        })
    } else if(subject instanceof NPC){
        const isEnemy = game.enemies.indexOf(subject) >= 0
        const noActiveEnemies = !game.enemies.filter(enemy => !enemy.hasTakenTurn).length

        // check to see if all enemies have gone and the subject is an enemy
        // if so, start a player turn
        if(isEnemy && noActiveEnemies){
            resolver.enqueueActions(new StartTurn({}, game.player, {}))
        }        
    }
})