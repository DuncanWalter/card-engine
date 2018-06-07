import { createStore, createReducer } from "./state";

export opaque type ID<+State:Object> = string

const entityIds = (function*(entropy): Generator<ID<any>, void, any, > {
    let i = 1
    while(true){
        yield `id:${entropy.toString(36)}:${(++i).toString(36)}`
    }
})(Date.now())

function createEntityId(): ID<any> {
    const { value } = entityIds.next()
    if(value){
        return value
    } else {
        throw new Error('ID generation failed')
    }
}

export type EntityStore = {
    [id: ID<any>]: any 
}

export function toExtractor(store: EntityStore){
    const entities: { [ID<any>]: Entity<> } = {}

    return function extract<T: Entity<>>(Cons: Class<T>, id: ID<any>): T {
        if(entities[id]){
            if(entities[id] instanceof Cons){
                return entities[id]
            }
        } else {
            if(store[id]){
                return new Cons(store[id], extract)
            }
        }
        throw new Error('Could not extract entity')
    }

}

export function toBundler(store: EntityStore){
    return function bundle<T:Object>(entity: Entity<T>): ID<T> {
        if(!store[entity.id]){
            store[entity.id] = entity.unwrap(entity.inner, bundle)
        }
        return entity.id
    }
}

// TODO: more exactly define types
export function toEntity<I: Entity<any, any>>(Cons: Class<I>, inner: *): I {
    const store = {}
    const bundle = toBundler(store)
    const extract = toExtractor(store)
    return new Cons(Cons.prototype.unwrap(inner, bundle), extract)
} 

export type Bundler = <T:Object>(Entity<T>) => ID<T>
export type Extractor = <T:Object>(Class<Entity<T>>, ID<T>) => *

export class Entity<State: Object = any, Inner: Object = any> {

    // TODO: munge into private fields
    +id: ID<State>
    inner: Inner

    constructor(state: State, extract: Extractor){
        this.id = createEntityId()
        this.inner = this.wrap(state, extract)
    }

    unwrap(inner: *, bundle: Bundler): State {
        return inner
    }

    wrap(state: *, extract: Extractor): Inner {
        return state
    }

    // is(other: ID<any> | Entity<any>): boolean {
    //     if(other instanceof Entity){
    //         return other.id == this.id
    //     } else {
    //         return other == this.id
    //     }
    // }
    
    // indexIn(others: Array<ID<any>|Entity<any>>): number {
    //     if(others.length){
    //         return others.map(other => {
    //             if(other instanceof(Entity)){
    //                 return other.id
    //             } else {
    //                 return other
    //             }
    //         }).indexOf(this.id)
    //     } else {
    //         return -1
    //     }
    // }

    clone(): * {
        const store: EntityStore = { }
        const extract = toExtractor(store)
        const bundle = toBundler(store)
        return new this.constructor(this.unwrap(this.inner, bundle), extract)
    }

}


