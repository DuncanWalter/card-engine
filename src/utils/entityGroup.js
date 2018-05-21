import type { ID, Entity } from '../utils/entity'
import { Sequence } from "../utils/random"

type State<T> = $Call<<S>(Class<Entity<S>>) => S, T>
type Cons<T> = $Call<<S>(Class<S>) => S, T>

// TODO: T should be the T where it is now Class<T>
// $FlowFixMe
export class EntityGroup<T:Class<Entity<Object>>> implements Iterable<Cons<T>> {

    ids: ID<State<T>>[]
    Subset: T

    constructor(Subset: T, ids: ID<State<T>>[]){
        this.ids = ids
        this.Subset = Subset
    }

    get size(): number {
        return this.ids.length
    }

    unwrap(): State<T>[] {
        return this.ids.map(id => new this.Subset(id).unwrap())
    }

    pop(): Cons<T> {
        return new this.Subset(this.ids.pop())
    }

    take(count: number): Cons<T>[] {
        let rr: Entity<State<T>>[] = []
        while(rr.length < count && this.ids.length){
            rr.push(new this.Subset(this.ids.pop()))
        }
        return rr
    }

    push(entity: Cons<T>): void {
        this.ids.push(entity.id)
    }

    add(...entities: Cons<T>[]){
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

    includes(entity: Cons<T>): boolean {
        return this.ids.includes(entity.id)
    }

    // TODO: make a boolean for safety...
    remove(entity: Cons<T>){
        this.ids.splice(this.ids.indexOf(entity.id), 1)
    }

    // $FlowFixMe
    [Symbol.iterator](){
        let self = this
        return (function*(): Generator<Entity<T>, any, any> {
            yield* self.ids.map(id => new self.Subset(id))
        })()
    } 
    
}
