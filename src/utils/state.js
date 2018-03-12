import { fromEvents, never } from 'kefir'

export class Slice<S:Object={}> {

    state: $ReadOnly<S>
    stream: $ReadOnly<any>
    dispatcher: $ReadOnly<any>

    __state__: S
    __reducers__: { [name: string]: (S, any) => S }

    constructor(reducers: { [name: string]: (S, any) => S }, initial: S){

        this.__reducers__ = reducers
        this.__state__ = initial
        const emitter = new Emitter(initial)
        this.stream = fromEvents(emitter, '')
        this.stream.emit = () => emitter.emit(this.__state__)

        this.dispatcher = Object.keys(reducers).reduce((acc, key) => {
            acc[key] = data => {
                const result = this.__reducers__[key](this.__state__, data)
                if (result === undefined) throw new Error(`Reducer returned undefined on key ${key}`)
                if (result == this.__state__) return
                this.__state__ = result
                emitter.emit(result)
            } 
            return acc
        }, Object.create(null))

        // $FlowFixMe
        this.state = Object.keys(initial).reduce((acc, key) => {
            Object.defineProperty(acc, key, {
                get: () => this.__state__[key]
            })
            return acc
        }, Object.create(null))
    }

}

// function combineSlices(sliceMap: { [name: string]: Slice<> }): Slice<> {

//     const self = new Slice({}, {})

//     const names = Object.keys(sliceMap)
//     const slices = names.map(key => sliceMap[key])


//     self.__state__ = names.reduce((acc, name, index) => {
//         acc[name] = slices[index].state
//     }, Object.create(null))
    
//     self.state = self.__state__

    
//     .reduce((acc, key) => {
//         const slice = slices[key]
//         Object.keys(slice.__reducers__).reduce((acc, key) => {
//             acc[key] = (acc[key] || [])
//             acc[key].push()
//         }, acc)
//     }, Object.create(null))





//     return self
// }













// export type StateSlice<S: Object=any, R: Object=any> = {
//     stream: any,
//     emit(): void,
//     dispatcher: { 
//         [reducer: $Keys<R>]: (data: any) => S 
//     },
// } & $ReadOnly<S> 

// const store = new Map()

// export function createSlice<S: Object, D: Object>(
//     owner: string, 
//     reducers: {[string]: (S, D) => S}, 
//     initial: S,
// ): (StateSlice<S, D>) {
//     if(store.has(owner)){
//         throw new Error('State slice name collision.');
//     } 

//     let slice = Object.assign({
//         state: initial,
//         watch: new Emitter(initial),
//         emit(){ this.watch.emit(this.state) },
//         dispatcher: Object.create(null),
//         stream: null,
//     }, reducers)
    
//     Object.keys(initial).reduce((a, k) => {
//         Object.defineProperty(a, k, {
//             get: () => slice.state[k]
//         })
//         return a
//     }, slice)

//     Object.keys(reducers).reduce((a, k) => {
//         Object.defineProperty(a, k, {
//             get: () => data => dispatch(k, data)
//         })
//         return a
//     }, slice.dispatcher)

//     slice.stream = fromEvents(slice.watch, '')

//     store.set(owner, slice)

//     return any(slice)

// }
    
// // function destroySlice(owner: any): void {
// //     if(store.has(owner)){
// //         store.delete(owner)
// //     }
// // }

// type d = (string | d, any) => void
// export function dispatch(type: string | d, data: any){
//     if(type instanceof Function){
//         type(dispatch)
//     } else if(typeof type == 'string'){
//         store.forEach((slice: any) => {
//             if(slice.hasOwnProperty(type)){
//                 // there is a reducer set up
//                 const prev = slice.state
//                 slice.state = slice[type](slice.state, data)
//                 if(prev !== slice.slice){
//                     // the reducer made changes
//                     slice.watch.emit(slice.state)
//                 }
//             }   
//         })
//     }
// }











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
