import { fromEvents, never, combine } from 'kefir'

export interface Slice<S={}> {
    state: $ReadOnly<S>,
    stream: $ReadOnly<any>,
    dispatcher: $ReadOnly<any>,
}



type Reducer = <Slice, Data, Global>(string, Slice, Data, Global) => Slice


// TODO: get union type of string-data pairs up
type  CreateReducer = <S, G>({ [string]: (S, *, G) => S }) => (S, any, G) => S
const createReducer: CreateReducer = reducers =>
    (action, slice, data, state) => 
        reducers[action] ?
            reducers[action](slice, data, state):
            slice;


// TODO: get union of strings and datas once again
type  CombineReducers = <R: { string: Reducer<any, any, any, any> }, G>(reducers: R) => Reducer<$ObjMap<R, <T>((any, any, any) => T) => T>, any, G>
const combineReducers: CombineReducers = reducers =>
    (action, slice, data, state) =>
        Object.keys(reducers).reduce((acc, key) => {
            acc[key] = reducers[key](action, slice[key], data, state)
            return acc
        })












export function createSlice<S>(reducers: { [name: string]: (S, any) => S }, initial: S): Slice<S> {

    let state: S = initial
    let emitter = new Emitter(initial)
    let slice = {} // Object.create(null)
    
    slice.stream = fromEvents(emitter, '')
    slice.stream.emit = () => emitter.emit(state)

    slice.dispatcher = new Proxy(reducers, {
        get(target, key){
            return data => {
                const reducer = target[key]
                const result = reducer ? reducer(state, data) : state
                if (result === undefined) throw new Error(`Reducer returned undefined on key ${key}`)
                if (result == state) return
                state = result
                emitter.emit(result)
            } 
        }
    })

    slice.state = new Proxy({ }, { 
        get(_, key){ 
            return state[key] 
        } 
    })

    // $FlowFixMe
    return slice
}



export function combineSlices(sliceMap: { [name: string]: Slice<any> }): Slice<any> {

    let slice = {}

    slice.stream = combine(Object.keys(sliceMap).map(key => sliceMap[key].stream))

    slice.dispatcher = new Proxy(sliceMap, {
        get(target, key){
            return data => {
                Object.keys(target).forEach(slice => target[slice].dispatcher[key](data))
            } 
        },
    })

    slice.state = new Proxy(sliceMap, {
        get(target, key){
            return target[key].state
        },
        set(){
            throw new Error('Cannot set state outside of a reducer')
        },
    })

    return slice
}






function any(any: any): any { return any }

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
