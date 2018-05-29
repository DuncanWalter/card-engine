import { SyncPromise, synchronize } from "../utils/async"
import { resolver } from '../events/eventResolver'
import { state, dispatch, stream } from '../state'
import { Monster } from "../creatures/monster";
import { queryTargets, rejectTargets, collectTargets } from "../game/combatState";
import { MonsterGroup } from "../creatures/monsterGroup";
import { Creature } from "../creatures/creature";
import { Entity } from "../utils/entity";
import { Card, BasicCardData } from "./card";

function any(any: any): any { return any }

// Allows cards to request targets from players while being played
export function queryEnemy<T>(): Promise<Monster> {
    // TODO: technically needs to refresh this every time
    let game = resolver.state.getGame()
    let enemies: MonsterGroup = game.enemies
    return new SyncPromise(resolve => {
        if(enemies.ids.length == 1){
            resolve(new Monster(enemies.ids[0])) 
        } else if(resolver.simulating){
            if(state.combat.focus && enemies.ids.includes(state.combat.focus)){
                // $FlowFixMe
                resolve(new Monster(state.combat.focus))
            } else {
                resolve(game.dummy)
            }
        } else {
            query(val => {
                return enemies.includes(new Entity(any(val)))
            }, val => resolve(new Monster(any(val))))
        }
    })
}

export function getEnemies(): Monster[] {
    let game = resolver.state.getGame()
    if(resolver.simulating){
        if(game.enemies.size == 1){
            return [...game.enemies]
        } else {
            return [game.dummy]
        }
    } else {
        return [...game.enemies]
    }
}

export let awaitAll = synchronize(function*anon<I>(items: Promise<I>[]): * {
    let res: I[] = []
    for(let promise of items){
        res.push(yield promise) 
    }
    return res
})

export function queryHand(prompted?: boolean): Promise<Card<> | void> {
    const battle = state.battle
    return new SyncPromise(resolve => {
        if(!prompted && battle.hand.length <= 1){
            const id = battle.hand[0]
            const card = id ? new Card(id) : undefined
            resolve(card)
        } else if(resolver.simulating && !prompted){
            resolve(undefined)
        } else {
            query(card => {
                return battle.hand.includes(card)
                // return resolver.state.getGame().hand.includes(new Card(any(card)))
            }, val => resolve(new Card(any(val))))
        }
    })
}





type Mask<D: Object> = $Shape<D>

export function upgrade<D:BasicCardData>(to: 'L' | 'R', CC: () => Card<D>, dataMask: Mask<D>, textMask?: { text?: string, title?: string }, modify?: Card<D> => any){
    return function(upgraded: void | 'L' | 'R'){
        if(upgraded){
            return undefined
        } else {
            let card = new CC()
            Object.assign(card.data, dataMask, { upgraded: to })
            Object.assign(card.appearance, textMask || {})
            if(modify){
                modify(card)
            }
            return card
        }
    }
}























export function query<T>(filter: mixed => boolean, resolve: T => void){
    
    let id = Math.random().toString() // TODO:
    dispatch(queryTargets(id))

    stream.map(state => 
        state.combat.queries[id]
    ).skipDuplicates().onValue(function cb(query): void {
        if(query){
            const rejections = query.submissions.filter(sub => !filter(sub))
            if(rejections.length){
                console.log('rejecting', query, rejections)
                setImmediate(() => dispatch(rejectTargets(id, rejections)))
            } else if(query.submissions.length){
                console.log('accepting', query, query.submissions)
                let targets = query.submissions
                setImmediate(() => dispatch(collectTargets(id)))
                resolve(targets[0])
                stream.offValue(cb)
            }
        }   
    })   
}
