import type { Component } from './component'
import { combineReducers, createStore } from "./utils/state"
import { entityReducer, entityInitial } from "./components/entityState"
import { battleReducer, battleInitial } from "./game/battle/battleState";
import { handReducer, handInitial } from "./game/hand/handState";
import { pathReducer, pathInitial } from "./paths/pathState"
import { overStream } from "./components/withAnimation";

const toAccessor = stream => {
    let capture: State = stream
    stream.onValue(v => capture = v)
    return new Proxy(capture, { 
        get(target: State, key){
            return capture[key]
        }
    })
}

const globalReducer = combineReducers({
    battle: battleReducer,
    hand: handReducer,
    entity: entityReducer,
    path: pathReducer,
    // settings
    // user
    // menu
})

// This is type magic that should get the global state type
export type State = $Call<<S>((S, *, *) => S) => S, typeof globalReducer>

export const { dispatch, stream } = createStore(globalReducer, {
    battle: battleInitial,
    hand: handInitial,
    entity: entityInitial,
    path: pathInitial,
})
export const state = toAccessor(stream)

export function withState<Props: Object>(component: Component<any>): Component<any> { 
    return overStream(stream, 'state')(component)
}




