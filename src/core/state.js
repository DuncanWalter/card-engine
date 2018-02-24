import { fromEvents, never } from 'kefir'

type StateSignature<O, S> = {
    stream: any, 
    destroy: () => void, 
    bind: ((S, O) => S) => void,
    view(): S,
    emit(): void,
}

const s = '@@state'; // Symbol('state');
const w = '@@watch'; // Symbol('watch');
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

export function State<O, S>(owner: O, reducers: {[string]: (S, any, O) => S}, initial: S): StateSignature<O, S> {
    if(store.has(owner)){
        throw new Error('State slice owner collision.');
    } else {
        const slice = Object.assign({
            [s]: initial, 
            [w]: new Emitter(initial),
        }, reducers);
        store.set(owner, slice);
        return {
            stream: fromEvents(slice[w], ''),
            destroy: () => destroy(owner),
            view: () => slice[s],
            emit: () => slice[w].emit(slice[s]),
            bind: (reducer: (state: S, owner: O) => S) => {
                const prev = slice[s];
                slice[s] = reducer(slice[s], owner);
                if(prev !== slice[s]){
                    // the reducer made changes
                    slice[w].emit(slice[s]);
                }
            },
        };
    }
};

export function dispatch(type: string | (typeof dispatch) => void, data: any): void {
    if(type instanceof Function){
        type(dispatch);
    } else if(typeof type == 'string'){
        store.forEach((slice, owner) => {
            if(slice.hasOwnProperty(type)){
                // there is a reducer set up
                const prev = slice[s];
                slice[s] = slice[type](slice[s], data, owner);
                if(prev !== slice[s]){
                    // the reducer made changes
                    slice[w].emit(slice[s]);
                }
            }   
        })
    }
};

// TODO: consider just deleting...
export function watch(owner: any): any {
    if(store.has(owner)){
        // $FlowFixMe
        return fromEvents(store.get(owner)[w], '');
    } else {
        return never();
    }
};

export function destroy(owner: any): void{
    if(store.has(owner)){
        store.delete(owner);
    }
};