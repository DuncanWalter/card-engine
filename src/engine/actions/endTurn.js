import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
import { StartTurn } from "./startTurn"
import { NPC } from "../creatures/npc"
import { LL } from "../../core/linkedList"
import type { CA } from "./action"

type Data = {
    effect: Symbol,
    stacks: number,
}


export const endTurn = Symbol('endTurn')
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
