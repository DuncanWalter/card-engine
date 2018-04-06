import { SyncPromise } from "../utils/async"
import { resolver } from "../actions/actionResolver"
import { battleSlice } from "../game/battle/battleState"
import { queryEntity } from "../components/entity"


let battle = battleSlice.state

// TODO: get rid of first parameter and make preprogrammed queries to cut out direct state imports

// Allows cards to request targets from players while being played
export function queryEnemy<T>(filter: (target: Object) => boolean): * {
    let __src__ = battle.enemies
    return new SyncPromise(resolve => {
        if(__src__.length <= 1){
            resolve(__src__[0]) // TODO: is undefined good here?
        } else if(resolver.simulating){
            resolve(battle.dummy) // TODO: is undefined good here?
        } else {
            queryEntity(t => __src__.includes(t) && filter(t), resolve)
        }
    })
}