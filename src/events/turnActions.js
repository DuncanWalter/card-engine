import type { Event } from './event'
import { defineEvent } from './event'
import { DrawCards } from './drawCards'
import { TakeTurn } from './takeTurn'
import { ConsumerArgs } from './listener'
import { BindEnergy } from './bindEnergy'

export const drain = 'drain'
export const fill = 'fill'
export const StartTurn = defineEvent('startTurn', function*({
  game,
  subject,
  resolver,
}) {
  if (subject.id == game.player.id) {
    yield resolver.processEvent(
      new BindEnergy(
        game.player,
        game.player,
        {
          quantity: -game.player.energy,
        },
        StartTurn,
        drain
      )
    )
    yield resolver.processEvent(
      new BindEnergy(
        game.player,
        game.player,
        {
          quantity: 3, // TODO: is it important to track max energy? // game.player.maxEnergy
        },
        StartTurn,
        fill
      )
    )
    yield resolver.processEvent(
      new DrawCards(game.player, game.player, { count: 5 }, StartTurn)
    )
    for (let ally of [...game.allies]) {
      yield resolver.processEvent(new StartTurn(ally, ally, {}))
    }
    game.player.inner.isActive = true
  }
})

export const EndTurn = defineEvent('endTurn', function*({
  subject,
  resolver,
  game,
}: ConsumerArgs<>) {
  if (subject.id == game.player.id) {
    // gameState.allies.reduce((acc, ally) => {
    //     acc.appendList(new LL(ally.takeTurn({ resolver, game: gameState })))
    //     return acc
    // }, new LL())

    game.player.inner.isActive = false

    while (game.hand.size) {
      game.discardPile.push(game.hand.pop())
    }

    resolver.enqueueEvents(
      ...[...game.allies].map((ally) => new TakeTurn(ally, ally, {}))
    )
    resolver.enqueueEvents(
      ...[...game.allies].map((ally) => new EndTurn(ally, ally, {}))
    )
    resolver.enqueueEvents(
      ...[...game.enemies].map((enemy) => new StartTurn(enemy, enemy, {}))
    )
    resolver.enqueueEvents(
      ...[...game.enemies].map((enemy) => new TakeTurn(enemy, enemy, {}))
    )
    resolver.enqueueEvents(
      ...[...game.enemies].map((enemy) => new EndTurn(enemy, enemy, {}))
    )
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
