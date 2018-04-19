import { SyncPromise } from "../utils/async"
import { resolver } from "../actions/actionResolver"
import { queryEntity } from "../components/entityState"
import { state, dispatch } from '../state'

// Allows cards to request targets from players while being played
export function queryEnemy<T>(filter: (target: Object) => boolean): * {
    let __src__ = state.battle.enemies
    return new SyncPromise(resolve => {
        if(__src__.length <= 1){
            resolve(__src__[0]) // TODO: is undefined good here?
        } else if(resolver.simulating){
            resolve(state.battle.dummy) // TODO: is undefined good here?
        } else {
            queryEntity(dispatch, t => __src__.includes(t) && filter(t), resolve)
        }
    })
}