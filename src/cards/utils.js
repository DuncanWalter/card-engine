import { queryTarget as queryUserTarget } from "../game/viewState"
import { SyncPromise } from "../utils/async"
import { resolver } from "../actions/actionResolver";

// TODO: get rid of first parameter and make preprogrammed queries to cut out direct state imports

// Allows cards to request targets from players while being played
export function queryTarget<T>(source: Iterable<T>, filter: (target: Object) => boolean): * {
    let __src__ = [...source]
    return new SyncPromise(resolve => {
        if(__src__.length <= 1){
            resolve(__src__[0]) // TODO: is undefined good here?
        } else if(resolver.simulating){
            resolve(undefined) // TODO: is undefined good here?
        } else {
            queryUserTarget(t => __src__.includes(t) && filter(t), resolve)
        }
    })
}