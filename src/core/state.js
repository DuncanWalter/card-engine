import { fromEvents, never } from 'kefir'

export type StateSlice<S: Object=any, D: Object=any> = {
    stream: any, 
    // bind: ((S, O) => S) => void, // TODO: re add when needed
    emit(): void,
} & $ReadOnly<S>


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



export function createStore(){
    const store = new Map()
    return {
        dispatch: Dispatch(store),
        createSlice: CreateSlice(store),
        destroySlice: DestroySlice(store),
    }
}


const CreateSlice = store => function createSlice<S: Object, D: Object>(
    owner: any, 
    reducers: {[string]: (S, D) => S}, 
    initial: S,
): (StateSlice<S, D>) {
    if(store.has(owner)){
        throw new Error('State slice owner collision.');
    } 
    
    let slice, accessor
    accessor = Object.keys(initial).reduce((a, k) => {
        Object.defineProperty(a, k, {
            get: () => slice.state[k]
        })
        return a
    }, {})

    slice = Object.create(accessor)
    Object.assign(slice, {
        state: initial,
        watch: new Emitter(initial),
        emit(){ 
            this.watch.emit(this.state) 
        },
        stream: null,
    }, reducers)
    
    slice.stream = fromEvents(slice.watch, '')

    store.set(owner, slice)

    return (slice: any)

}

    
    
const DestroySlice = store => function destroySlice(owner: any): void {
    if(store.has(owner)){
        store.delete(owner)
    }
}


type d = (string | d, any) => void
const Dispatch = store => function dispatch(type: string | d, data: any){
    if(type instanceof Function){
        type(dispatch)
    } else if(typeof type == 'string'){
        store.forEach((slice: *) => {
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
