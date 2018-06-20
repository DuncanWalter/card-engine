import { SyncPromise, synchronize } from '../utils/async'
import { resolver } from '../events/eventResolver'
import { state, dispatch, stream } from '../state'
import { Monster } from '../creatures/monster'
import {
  queryTargets,
  rejectTargets,
  collectTargets,
} from '../game/combatState'
import { MonsterGroup } from '../creatures/monsterGroup'
import { Creature } from '../creatures/creature'
import { Entity } from '../utils/entity'
import { Card, BasicCardData } from './card'
import { Game } from '../game/battle/battleState'

function any(any: any): any {
  return any
}

// Allows cards to request targets from players while being played
export function queryEnemy<T>(game: $ReadOnly<Game>): Promise<Monster> {
  // TODO: technically needs to refresh this every time
  let enemies: MonsterGroup = game.enemies
  return new SyncPromise((resolve) => {
    if (enemies.size == 1) {
      resolve(enemies.entities[0])
    } else if (resolver.simulating) {
      if (
        state.combat.focus &&
        enemies.entities.map((enemy) => enemy.id).includes(state.combat.focus)
      ) {
        // TODO: wont work
        game.enemies.entities.forEach((enemy) => {
          if (enemy.id == state.combat.focus) {
            resolve(enemy) // TODO: solve the case where this is just not found...
          }
        })
      } else {
        resolve(game.dummy)
      }
    } else {
      query(
        (enemy) => {
          return (
            console.log('checking') ||
            game.enemies.entities.map((enemy) => enemy.id).includes(enemy)
          )
          // return resolver.state.getGame().hand.includes(new Card(any(card)))
        },
        (enemy) => {
          console.log('resolving')
          game.enemies.entities.forEach((__enemy__) => {
            if (__enemy__.id == enemy) {
              resolve(__enemy__) // TODO: solve the case where this is just not found...
            }
          })
        }
      )
    }
  })
}

export function getEnemies(game: $ReadOnly<Game>): Monster[] {
  if (resolver.simulating) {
    if (game.enemies.size == 1) {
      return [...game.enemies]
    } else {
      return [game.dummy]
    }
  } else {
    return [...game.enemies]
  }
}

export let awaitAll = synchronize(function* anon<I>(items: Promise<I>[]): * {
  let res: I[] = []
  for (let promise of items) {
    res.push(yield promise)
  }
  return res
})

export function queryHand(
  game: $ReadOnly<Game>,
  prompted?: boolean
): Promise<Card<> | void> {
  return new SyncPromise((resolve) => {
    if (!prompted && game.hand.size <= 1) {
      const card = game.hand.entities[0]
      resolve(card)
    } else if (resolver.simulating && !prompted) {
      resolve(undefined)
    } else {
      query(
        (card) => {
          return (
            console.log('checking') ||
            game.hand.entities.map((card) => card.id).includes(card)
          )
          // return resolver.state.getGame().hand.includes(new Card(any(card)))
        },
        (card) => {
          console.log('resolving')
          game.hand.entities.forEach((__card__) => {
            if (__card__.id == card) {
              resolve(__card__) // TODO: solve the case where this is just not found...
            }
          })
        }
      )
    }
  })
}

type Mask<D: Object> = $Shape<D>

export function upgrade<D: BasicCardData>(
  to: 'L' | 'R',
  CC: () => Card<D>,
  dataMask: Mask<D>,
  textMask?: { text?: string, title?: string },
  modify?: (Card<D>) => any
) {
  return function(upgraded: void | 'L' | 'R') {
    if (upgraded) {
      return undefined
    } else {
      let card = new CC()
      Object.assign(card.data, dataMask, { upgraded: to })
      Object.assign(card.appearance, textMask || {})
      if (modify) {
        modify(card)
      }
      return card
    }
  }
}

export function query<T>(filter: (mixed) => boolean, resolve: (T) => void) {
  let id = Math.random().toString() // TODO:
  dispatch(queryTargets(id))

  stream
    .map((state) => state.combat.queries[id])
    .skipDuplicates()
    .onValue(function cb(query): void {
      if (query) {
        const rejections = query.submissions.filter((sub) => !filter(sub))
        if (rejections.length) {
          console.log('rejecting', query, rejections)
          setImmediate(() => dispatch(rejectTargets(id, rejections)))
        } else if (query.submissions.length) {
          console.log('accepting', query, query.submissions)
          let targets = query.submissions
          setImmediate(() => dispatch(collectTargets(id)))
          resolve(targets[0])
          stream.offValue(cb)
        }
      }
    })
}
