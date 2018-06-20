import { Creature } from './creature'
import { state } from '../state'
import { Sequence } from '../utils/random'
import { Monster } from './monster'
import { Player } from './player'
import { Game } from '../game/battle/battleState'

export function pickTarget(game: $ReadOnly<Game>, self: Monster): Creature<> {
  if (game.enemies.includes(self)) {
    return game.player

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
    const enemies = game.enemies.entities
    return enemies[Math.floor(self.seed.next() * enemies.length)]
  }
}
