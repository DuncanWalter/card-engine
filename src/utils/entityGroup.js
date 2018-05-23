import type { ID, Entity } from '../utils/entity'
import { Sequence } from "../utils/random"

type State<T> = $Call<<S>(Entity<S>) => S, T>
// type Cons<T> = $Call<<S>(Class<S>) => S, T>

// TODO: T should be the T where it is now Class<T>
// $FlowFixMe
export class EntityGroup<T:Entity<Object>> implements Iterable<Cons<T>> {

    ids: ID<State<T>>[]
    Subset: Class<T>

    constructor(Subset: Class<T>, ids: ID<State<T>>[]){
        this.ids = ids
        this.Subset = Subset
    }

    get size(): number {
        return this.ids.length
    }

    unwrap(): State<T>[] {
        return this.ids.map(id => new this.Subset(id).unwrap())
    }

    pop(): T {
        return new this.Subset(this.ids.pop())
    }

    take(count: number): T[] {
        let rr: T[] = []
        while(rr.length < count && this.ids.length){
            rr.push(new this.Subset(this.ids.pop()))
        }
        return rr
    }

    push(entity: T): void {
        this.ids.push(entity.id)
    }

    add(...entities: T[]){
        this.ids.splice(0, 0, ...entities.map(entity => entity.id))
    }

    shallowClone(): EntityGroup<T> {
        return new EntityGroup(this.Subset, [...this.ids])
    }

    deepClone(): EntityGroup<T> {
        return new EntityGroup(this.Subset, [...this.ids.map(id => 
            (new this.Subset(id)).clone().id
        )])
    }

    clear(): void {
        this.ids.splice(0, this.ids.length)
    }

    includes(entity: Entity<any>): boolean {
        return this.ids.includes(entity.id)
    }

    // TODO: make a boolean for safety...
    remove(entity: Entity<any>){
        this.ids.splice(this.ids.indexOf(entity.id), 1)
    }

    // $FlowFixMe
    [Symbol.iterator](){
        return (function*(self: EntityGroup<T>): Generator<T, any, any> {
            yield* self.ids.map(id => new self.Subset(id))
        })(this)
    } 
    
}
