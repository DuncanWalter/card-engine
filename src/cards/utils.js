import { SyncPromise } from "../utils/async"
import { resolver } from '../events/eventResolver'
import { queryEntity } from "../components/entityState"
import { state, dispatch } from '../state'
import { Monster } from "../creatures/monster";

// Allows cards to request targets from players while being played
export function queryEnemy<T>(filter: (target: Object) => boolean): Promise<Monster> {
    let __src__ = resolver.state.getGame().enemies
    return new SyncPromise(resolve => {
        if(__src__.length <= 1){
            resolve(__src__[0]) // TODO: is undefined good here?
        } else if(resolver.simulating){
            resolve(resolver.state.getGame().dummy) // TODO: is undefined good here?
        } else {
            queryEntity(dispatch, t => !!__src__.filter(s => s.id == t.id).length && filter(t), resolve)
        }
    })
}