// entities are objects with a POJO state representation, but also with class behavior. 
// they can be serialized and and recovered using ids etc.

export const entityIds = (function*(): Generator<string, void, any, > {
    let i = 1
    while(true){
        yield `id:${(++i).toString(36)}`
    }
})()

interface HasId { id: string }

export class Entity<State: Object> {

    get id(): string {
        return this.id
    }
    +inner: State

    unwrap(): State {
        return this.inner
    }

    is(other: State | Entity<any>): boolean {
        return other.id == this.id
    }

    constructor(state: State){
        if(state.id){
            // $FlowFixMe
            this.inner = state
        } else {
            const { value, done } = entityIds.next()
            if(value){
                this.inner = { ...state, id: value }
            } else {
                throw new Error('Id generation failed.')
            }
        }
    }
}




