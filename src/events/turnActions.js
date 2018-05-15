import type { Event } from './event'
import { defineEvent, startTurn, endTurn } from "./event"
import { Creature } from "../creatures/creature"
import { Player } from "../creatures/player"
// import { NPC } from "../creatures/npc"
import { DrawCards } from "./drawCards"
import { TakeTurn } from "./takeTurn"
import { ConsumerArgs } from "./listener"
import { BindEnergy } from "./bindEnergy"

export const drain = Symbol('drain')
export const fill  = Symbol('fill')
export { startTurn }
export const StartTurn = defineEvent(startTurn, function*({ game, subject, resolver }){ 
    if(subject instanceof Player){
        yield resolver.processEvent(new BindEnergy(game.player, game.player, { 
            quantity: -game.player.energy 
        }, startTurn, drain))
        yield resolver.processEvent(new BindEnergy(game.player, game.player, { 
            quantity: 3 // TODO: is it important to track max energy? // game.player.maxEnergy
        }, startTurn, fill))
        yield resolver.processEvent(new DrawCards(game.player, game.player, { count: 5 }, startTurn))
        for(let ally of [...game.allies]){
            yield resolver.processEvent(new StartTurn(ally, ally, {}))
        }
        game.player.inner.data.isActive = true
    }
})

export { endTurn }
export const EndTurn = defineEvent(endTurn, function*({ subject, resolver, game }){
    if(subject instanceof Player){
        // gameState.allies.reduce((acc, ally) => {
        //     acc.appendList(new LL(ally.takeTurn({ resolver, game: gameState })))
        //     return acc
        // }, new LL())

        game.player.inner.data.isActive = false

        while(game.hand.size){
            game.discardPile.addToTop(game.hand.take()[0])
        }

        resolver.enqueueEvents(...game.allies.map(ally => new TakeTurn(ally, ally, {})))
        resolver.enqueueEvents(...game.allies.map(ally => new EndTurn(ally, ally, {})))
        resolver.enqueueEvents(...game.enemies.map(enemy => new StartTurn(enemy, enemy, {})))
        resolver.enqueueEvents(...game.enemies.map(enemy => new TakeTurn(enemy, enemy, {})))
        resolver.enqueueEvents(...game.enemies.map(enemy => new EndTurn(enemy, enemy, {})))
        resolver.enqueueEvents(new StartTurn(game.player, game.player, {}))

    } 
    // else if(subject instanceof NPC){
    //     // const isEnemy = game.enemies.indexOf(subject) >= 0
    //     // const noActiveEnemies = !game.enemies.filter(enemy => !enemy.hasTakenTurn).length

    //     // // check to see if all enemies have gone and the subject is an enemy
    //     // // if so, start a player turn
    //     // if(isEnemy && noActiveEnemies){
    //     //     resolver.enqueueEvents(new StartTurn({}, game.player, {}))
    //     // }        
    // }
})