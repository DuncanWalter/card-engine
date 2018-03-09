import { gameSlice } from "../gameState";
import { queryTarget as queryUserTarget } from "../../chassis/view";
import { SyncPromise } from "../../core/async";




export function queryTarget<T>(source: T[], filter: (target: Object) => boolean): * {
    return new SyncPromise(resolve => {
        if(source.length <= 1){
            resolve(source[0])
        } else if(gameSlice.resolver.simulating){
            resolve(undefined)
        } else {
            queryUserTarget(t => source.indexOf(t) >= 0 && filter(t), resolve)
        }
    })
}