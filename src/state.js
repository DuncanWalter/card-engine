import { combineReducers, createStore, Store } from "./utils/state"
import { battleReducer, battleInitial, emit } from "./game/battle/battleState"
import { handReducer, handInitial } from "./game/hand/handState"
import { pathReducer, pathInitial } from "./paths/pathState"
import { overStream } from "./components/withAnimation"
import { menuReducer, menuInitial } from "./menu/menuState"
import { combatReducer, combatInitial } from "./game/combatState";

const toAccessor = (stream) => {
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
    path: pathReducer,
    menu: menuReducer,
    combat: combatReducer,
    // settings
    // user
})

const globalInitial = {
    battle: battleInitial,
    hand: handInitial,
    path: pathInitial,
    menu: menuInitial,
    combat: combatInitial,
}

// This is type magic that should get the global state type
export type State = $Call<<S>((S, *, *) => S) => S, typeof globalReducer>

export const { dispatch, stream }: Store<typeof globalInitial> = createStore(globalReducer, globalInitial)

export const state = toAccessor(stream)

export function withState<Props: Object>(component: Component<any>): Component<any> { 
    return overStream(stream, 'state', state)(component)
}