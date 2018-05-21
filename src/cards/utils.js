import { SyncPromise } from "../utils/async"
import { resolver } from '../events/eventResolver'
import { state, dispatch, stream } from '../state'
import { Monster } from "../creatures/monster";
import { queryTargets, rejectTargets, collectTargets } from "../game/combatState";
import { MonsterGroup } from "../creatures/monsterGroup";
import { Creature } from "../creatures/creature";

// Allows cards to request targets from players while being played
export function queryEnemy<T>(filter: (target: Object) => boolean): Promise<Monster> {
    let game = resolver.state.getGame()
    let __src__: MonsterGroup = game.enemies
    return new SyncPromise(resolve => {
        if(__src__.ids.length == 1){
            resolve(new Monster(__src__.ids[0])) 
        } else if(resolver.simulating){
            if(state.combat.focus && __src__.ids.includes(state.combat.focus)){
                resolve(new Monster(state.combat.focus))
            } else {
                resolve(game.dummy)
            }
        } else {
            query('monster', monster => {
                return __src__.includes(new Monster(monster))
            }, val => resolve(new Monster(val[0])), 1)
        }
    })
}

export function query(category: string, filter: any => boolean, resolve: any => void, quant: number){
    let id = Math.random().toString() // TODO:
    dispatch(queryTargets(id, category))
    stream.map(state => 
        state.combat.queries[id]
    ).skipDuplicates().map(state => 
        console.log(state) || state
    ).onValue(function cb(query): void {
        if(query){
            const rejections = query.submissions.filter(sub => 
                !filter(sub)
            )
            if(rejections.length){
                console.log('rejecting', query, rejections)
                setImmediate(() => dispatch(rejectTargets(id, rejections)))
            } else {
                if(query.submissions.length >= quant){
                    console.log('accepting', query, query.submissions)
                    let targets = query.submissions
                    setImmediate(() => dispatch(collectTargets(id)))
                    resolve(targets)
                }
            }
        } else {
            console.log('UNHOOKING. YAY.', query)
            stream.offValue(cb)
        }
    })   
}
