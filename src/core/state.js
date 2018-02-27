import { fromEvents, never } from 'kefir'

export type StateSlice<O, S: Object, D: Object> = {
    stream: any, 
    destroy: () => void, 
    // bind: ((S, O) => S) => void, // TODO: re add when needed
    // view(): S,
    emit(): void,
    
} & $ReadOnly<S>

// const s = '@@state'; // Symbol('state');
// const w = '@@watch'; // Symbol('watch');
const store = new Map();

function Emitter(initial){
    return {
        addEventListener(__, fn){
            this.listeners.add(fn);
            fn(this.last);
        },
        removeEventListener(__, fn){
            this.listeners.delete(fn);
        },
        emit(event){
            this.listeners.forEach(fn => fn(event));
            this.last = event;
        },
        listeners: new Set(),
        last: initial,
    };
};

export function State<O, S: Object, D: Object>(
    owner: O, 
    reducers: {[string]: (S, D, O) => S}, 
    initial: S,
): (StateSlice<O, S, D>) {
    if(store.has(owner)){
        throw new Error('State slice owner collision.');
    } else {

        let slice, accessor

        accessor = Object.keys(initial).reduce((a, k) => {
            Object.defineProperty(a, k, {
                get: () => slice.state[k]
            })
            return a
        }, {})

        slice = Object.create(accessor)
        slice = Object.assign(slice, {
            state: initial,
            watch: new Emitter(initial),
            destroy(){
                destroy(owner)
            },
            emit(){ 
                this.watch.emit(this.state) 
            },
            stream: null,
        }, reducers)
        
        slice.stream = fromEvents(slice.watch, '')

        store.set(owner, slice)

        return (slice: any) 

        // {
        //     stream: fromEvents(slice.watch, ''),
        //     destroy: () => destroy(owner),
        //     emit: () => slice.watch.emit(slice.state),
        //     bind: (reducer: (state: S, owner: O) => S) => {
        //         const prev = slice.state;
        //         slice.state = reducer(slice.state, owner);
        //         if(prev !== slice.state){
        //             // the reducer made changes
        //             slice.watch.emit(slice.state);
        //         }
        //     },
        // };
    }
};

export function dispatch(type: string | (typeof dispatch) => void, data: any): void {

    console.log('dispatch', type, data);

    if(type instanceof Function){
        type(dispatch);
    } else if(typeof type == 'string'){
        store.forEach((slice: *, owner: *) => {
            if(slice.hasOwnProperty(type)){
                // there is a reducer set up
                const prev = slice.state;
                slice.state = slice[type](slice.state, data, owner);
                // if(prev !== slice.slice){
                    // the reducer made changes
                    slice.watch.emit(slice.state);
                // }
            }   
        })
    }
};

// TODO: consider just deleting...
export function watch(owner: any): any {
    if(store.has(owner)){
        // $FlowFixMe
        return fromEvents(store.get(owner).watch, '');
    } else {
        return never();
    }
};

export function destroy(owner: any): void{
    if(store.has(owner)){
        store.delete(owner);
    }
};