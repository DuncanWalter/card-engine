import { fromEvents, never, combine } from 'kefir'

export interface Slice<S={}> {
    state: $ReadOnly<S>,
    stream: $ReadOnly<any>,
    dispatcher: $ReadOnly<any>,
}

let lastTime = Date.now()
let dispatches = []
function runStats(type){
    dispatches.push(type)
    if(Date.now() - lastTime > 15000){
        console.log('Dispatch Stats', dispatches.length, dispatches.reduce((acc, type) => {
            if(acc[type]){
                acc[type]++
            } else {
                acc[type] = 1
            }
            return acc
        }, {}))
        dispatches = []
        lastTime = Date.now()
    }
}



interface ReducerAction { type: string }
export type Reducer<Slice, Action: ReducerAction, Global> = (Slice, Action, Global) => Slice

// TODO: get union type of string-action pairs up
export function createReducer<S, G>(reducers: { [string]: Reducer<S, any, G> }): Reducer<S, any, G> {
    return (slice, action, state) => 
        reducers[action.type] ?
            reducers[action.type](slice, action, state):
            slice;
}

// TODO: get union of strings and actions once again
type CombineReducers = <R: { [string]: Reducer<any, any, any> }, G>(reducers: R) => Reducer<$ObjMap<R, <T>((any, any, any) => T) => T>, ReducerAction, G>
export const combineReducers: CombineReducers = reducers =>
    (slice, action, state) => 
        Object.keys(reducers).reduce((acc, key) => {
            let result = reducers[key](slice[key], action, state)
            if(slice[key] !== result){
                if(slice !== acc){
                    acc[key] = result
                    return acc
                } else {
                    let clone = { ...slice }
                    clone[key] = result
                    return clone
                }
            } else {
                return acc
            }
        }, slice)
    

export function createStore<S>(reducer: Reducer<S, *, S>, initial: S): { dispatch: (ReducerAction) => void, stream: any } {
    let state = initial
    let emitter = new Emitter(initial)
    let stream = fromEvents(emitter, '')
    return {
        dispatch(action){
            runStats(action.type)
            let newState = reducer(state, action, state)
            if(!newState){
                throw Error('Reducer returned void value; maybe a return statement was forgotten?')
            }
            if(state != newState){
                state = newState
                emitter.emit(newState)
            }
        },
        stream,
    }
}

export type Dispatch = (ReducerAction) => void


function Emitter(initial){
    return {
        addEventListener(_, fn){
            this.listeners.add(fn)
            fn(this.last)
        },
        removeEventListener(_, fn){
            this.listeners.delete(fn)
        },
        emit(event){
            this.listeners.forEach(fn => fn(event))
            this.last = event
        },
        listeners: new Set(),
        last: initial,
    }
}








// export function createSlice<S>(reducers: { [name: string]: (S, any) => S }, initial: S): Slice<S> {

//     let state: S = initial
//     let emitter = new Emitter(initial)
//     let slice = {} // Object.create(null)
    
//     slice.stream = fromEvents(emitter, '')
//     slice.stream.emit = () => emitter.emit(state)

//     slice.dispatcher = new Proxy(reducers, {
//         get(target, key){
//             return data => {
//                 const reducer = target[key]
//                 const result = reducer ? reducer(state, data) : state
//                 if (result === undefined) throw new Error(`Reducer returned undefined on key ${key}`)
//                 if (result == state) return
//                 state = result
//                 emitter.emit(result)
//             } 
//         }
//     })

//     slice.state = new Proxy({ }, { 
//         get(_, key){ 
//             return state[key] 
//         } 
//     })

//     // $FlowFixMe
//     return slice
// }



// export function combineSlices(sliceMap: { [name: string]: Slice<any> }): Slice<any> {

//     let slice = {}

//     slice.stream = combine(Object.keys(sliceMap).map(key => sliceMap[key].stream))

//     slice.dispatcher = new Proxy(sliceMap, {
//         get(target, key){
//             return data => {
//                 Object.keys(target).forEach(slice => target[slice].dispatcher[key](data))
//             } 
//         },
//     })

//     slice.state = new Proxy(sliceMap, {
//         get(target, key){
//             return target[key].state
//         },
//         set(){
//             throw new Error('Cannot set state outside of a reducer')
//         },
//     })

//     return slice
// }






// function any(any: any): any { return any }

