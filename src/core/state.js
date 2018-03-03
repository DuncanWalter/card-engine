import { fromEvents, never } from 'kefir'

export type StateSlice<S: Object=any, R: Object=any> = {
    stream: any,
    emit(): void,
    dispatcher: { 
        [reducer: $Keys<R>]: (data: any) => S 
    },
} & $ReadOnly<S> 

const store = new Map()

export function createSlice<S: Object, D: Object>(
    owner: string, 
    reducers: {[string]: (S, D) => S}, 
    initial: S,
): (StateSlice<S, D>) {
    if(store.has(owner)){
        throw new Error('State slice name collision.');
    } 

    let slice = Object.assign({
        state: initial,
        watch: new Emitter(initial),
        emit(){ this.watch.emit(this.state) },
        dispatcher: Object.create(null),
        stream: null,
    }, reducers)
    
    Object.keys(initial).reduce((a, k) => {
        Object.defineProperty(a, k, {
            get: () => slice.state[k]
        })
        return a
    }, slice)

    Object.keys(reducers).reduce((a, k) => {
        Object.defineProperty(a, k, {
            get: () => data => dispatch(k, data)
        })
        return a
    }, slice.dispatcher)

    slice.stream = fromEvents(slice.watch, '')

    store.set(owner, slice)

    return any(slice)

}
    
// function destroySlice(owner: any): void {
//     if(store.has(owner)){
//         store.delete(owner)
//     }
// }

type d = (string | d, any) => void
function dispatch(type: string | d, data: any){
    if(type instanceof Function){
        type(dispatch)
    } else if(typeof type == 'string'){
        store.forEach((slice: any) => {
            if(slice.hasOwnProperty(type)){
                // there is a reducer set up
                const prev = slice.state
                slice.state = slice[type](slice.state, data)
                if(prev !== slice.slice){
                    // the reducer made changes
                    slice.watch.emit(slice.state)
                }
            }   
        })
    }
}











function any(any: any): any { return any }

function Emitter(initial){
    return {
        addEventListener(__, fn){
            this.listeners.add(fn)
            fn(this.last)
        },
        removeEventListener(__, fn){
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
