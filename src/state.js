import { combineReducers, createStore, Store, type Reducer } from "./utils/state"
import { handReducer, handInitial, HandState } from "./game/hand/handState"
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
    // battle: GameState,
    hand: HandState,
    menu: MenuState,
    combat: CombatState,
}

const globalInitial: State = {
    // battle: battleInitial,
    hand: handInitial,
    menu: menuInitial,
    combat: combatInitial,
}

const globalReducer: Reducer<State, State> = combineReducers({
    // battle: battleReducer,
    hand: handReducer,
    menu: menuReducer,
    combat: combatReducer,
    // settings
    // user
})

export const { dispatch, stream }: Store<State> = createStore(globalReducer, globalInitial)

export const state = toAccessor(stream)

// TODO: add selector crap?
export function withState<Props: Object>(component: (props: Props) => *): (props: $Diff<Props, { state: State }>) => * { 

    return props => component({ ...props, state })


    // return overStream(stream, 'state', state)(component)
}