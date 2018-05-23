import { combineReducers, createStore, Store, type Reducer } from "./utils/state"
import { battleReducer, battleInitial, emit, GameState } from "./game/battle/battleState"
import { handReducer, handInitial, HandState } from "./game/hand/handState"
import { pathReducer, pathInitial, PathState } from "./paths/pathState"
import { overStream } from "./components/withAnimation"
import { menuReducer, menuInitial, MenuState } from "./menu/menuState"
import { combatReducer, combatInitial, CombatState } from "./game/combatState";

const toAccessor = (stream) => {
    let capture: State = stream
    stream.onValue(v => capture = v)
    return new Proxy(capture, { 
        get(target: State, key){
            return capture[key]
        }
    })
}

export type State = {
    battle: GameState,
    hand: HandState,
    path: PathState,
    menu: MenuState,
    combat: CombatState,
}

const globalInitial: State = {
    battle: battleInitial,
    hand: handInitial,
    path: pathInitial,
    menu: menuInitial,
    combat: combatInitial,
}

const globalReducer: Reducer<State, State> = combineReducers({
    battle: battleReducer,
    hand: handReducer,
    path: pathReducer,
    menu: menuReducer,
    combat: combatReducer,
    // settings
    // user
})

export const { dispatch, stream }: Store<State> = createStore(globalReducer, globalInitial)

export const state = toAccessor(stream)

// TODO: add selector crap?
export function withState<Props: Object>(component: Component<any>): Component<any> { 
    return overStream(stream, 'state', state)(component)
}