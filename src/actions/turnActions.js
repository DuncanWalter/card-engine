import type { CustomAction } from './action'
import { MetaAction, startTurn, endTurn } from "./action"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { DrawCard } from "./drawCard"
import { TakeTurn } from "./takeTurn"
import { ConsumerArgs } from "./listener"
import { BindEnergy } from "./bindEnergy"

export const drain = Symbol('drain')
export const fill  = Symbol('fill')
export { startTurn }
export const StartTurn: CustomAction<> = MetaAction(startTurn, function*({ game, subject, resolver }):*{ 
    if(subject instanceof Player){
        yield resolver.processAction(new BindEnergy({}, {}, { 
            quantity: -game.player.energy 
        }), startTurn, drain)
        yield resolver.processAction(new BindEnergy({}, {}, { 
            quantity: game.player.maxEnergy 
        }), startTurn, fill)
        resolver.enqueueActions(new DrawCard(game.player, {}, { count: 5 }, startTurn))
        resolver.enqueueActions(...game.allies.map(ally => new StartTurn({}, ally, {})))
    }
})

export { endTurn }
export const EndTurn: CustomAction<any, Creature> = MetaAction(endTurn, ({ subject, resolver, game }: ConsumerArgs<>) => {
    if(subject instanceof Player){
        // gameState.allies.reduce((acc, ally) => {
        //     acc.appendList(new LL(ally.takeTurn({ resolver, game: gameState })))
        //     return acc
        // }, new LL())

        while(game.hand.size){
            game.discardPile.addToTop(game.hand.take()[0])
        }

        resolver.enqueueActions(...game.allies.map(ally => new TakeTurn({}, ally, {})))
        resolver.enqueueActions(...game.allies.map(ally => new EndTurn({}, ally, {})))
        resolver.enqueueActions(...game.enemies.map(enemy => new StartTurn({}, enemy, {})))
        resolver.enqueueActions(...game.enemies.map(enemy => new TakeTurn({}, enemy, {})))
        resolver.enqueueActions(...game.enemies.map(enemy => new EndTurn({}, enemy, {})))
        resolver.enqueueActions(new StartTurn({}, game.player, {}))
        resolver.enqueueActions(...game.allies.map(ally => new StartTurn({}, ally, {})))

    } else if(subject instanceof NPC){
        // const isEnemy = game.enemies.indexOf(subject) >= 0
        // const noActiveEnemies = !game.enemies.filter(enemy => !enemy.hasTakenTurn).length

        // // check to see if all enemies have gone and the subject is an enemy
        // // if so, start a player turn
        // if(isEnemy && noActiveEnemies){
        //     resolver.enqueueActions(new StartTurn({}, game.player, {}))
        // }        
    }
})