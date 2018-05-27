import { createStore, createReducer } from "./state";

export opaque type ID<+State:Object> = string

interface EntityStoreState {
    [subset: string]: { [id: string]: any } 
}

const entityIds = (function*(entropy): Generator<ID<any>, void, any, > {
    let i = 1
    while(true){
        yield `id:${entropy.toString(36)}:${(++i).toString(36)}`
    }
})(Date.now())

function addEntity<T>(id: ID<T>, Subset: Class<Entity<T>>, entity: T){
    dispatch({
        type: 'addEntity',
        id,
        Subset,
        entity,
    })
}

const { stream, dispatch } = createStore(createReducer({
    addEntity(slice, { id, Subset, entity }){
        if(!slice[Subset.name]){
            slice[Subset.name] = {}
        }
        slice[Subset.name][id] = entity
        return {
            ...slice,
        }
    }
}), {})

let state = {}
stream.onValue(v => (state = v))

export function createEntity<T:Object>(Subset: Class<Entity<T>>, state: T): ID<T> { 
    const { value } = entityIds.next()
    if(value){
        addEntity(value, Subset, state)
        return value
    } else {
        throw new Error('Entity ID Generation failed.')
    }
}

export class Entity<+State: Object = any> {

    +id: ID<State>

    get inner(): State {
        return this.unwrap()
    }

    constructor(id: ID<State>){
        if(typeof id == 'string'){
            this.id = id
        } else {
            throw new Error('Invalid Id ' + id)
        }
    }
    
    unwrap(): State {
        let inner = state[this.constructor.name][this.id]
        if(inner){
            return inner
        } else {
            console.log(this, this.id)
            throw Error('No entity data found')
        }
    }

    is(other: ID<any> | Entity<any>): boolean {
        if(other instanceof Entity){
            return other.id == this.id
        } else {
            return other == this.id
        }
    }
    
    indexIn(others: Array<ID<any>|Entity<any>>): number {
        if(others.length){
            if(others[0] instanceof Entity){
                return others.map(entity => entity.id).indexOf(this.id)
            } else {
                return others.indexOf(this.id)
            }
        } else {
            return -1
        }
    }

    clone(): Entity<State> {
        return new this.constructor(createEntity(this.constructor, {...this.unwrap()}))
    }

}


