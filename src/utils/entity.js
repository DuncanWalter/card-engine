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
        return this.inner.id
    }
    
    +inner: State

    unwrap(): State & HasId {
        return this.inner
    }

    valueOf(){
        return this.inner.id
    }

    is(other: State | Entity<any>): boolean {
        return other.id == this.id
    }
    
    isIn(others: State[]): number {
        return others.map(other => other.id).indexOf(this.inner.id)
    }

    constructor(state: State & { id?: string }){
        if(state.id){
            // $FlowFixMe
            this.inner = state
        } else {
            const { value, done } = entityIds.next()
            if(value){
                state.id = value
                this.inner = state
            } else {
                throw new Error('Id generation failed.')
            }
        }
    }
}




