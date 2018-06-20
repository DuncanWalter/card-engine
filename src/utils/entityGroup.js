import type { ID, Entity } from '../utils/entity'
import { Sequence } from '../utils/random'

type State<T> = $Call<<S>(Entity<S>) => S, T>
// type Cons<T> = $Call<<S>(Class<S>) => S, T>

// TODO: T should be the T where it is now Class<T>

// $FlowFixMe
export class EntityGroup<T: Entity<Object>> implements Iterable<T> {
  entities: T[]
  static Subset: Class<T>

  constructor(entities: T[]) {
    this.entities = entities
  }

  static from(extract: (Class<T>, ID<State<T>>) => T, ids: ID<State<T>>[]): * {
    return new this.constructor(ids.map((id) => extract(this.Subset, id)))
  }

  get size(): number {
    return this.entities.length
  }

  pop(): T {
    return this.entities.pop()
  }

  take(count: number): T[] {
    let rr: T[] = []
    while (rr.length < count && this.entities.length) {
      rr.push(this.entities.pop())
    }
    return rr
  }

  push(entity: T): void {
    this.entities.push(entity)
  }

  add(...entities: T[]) {
    this.entities.splice(0, 0, ...entities)
  }

  shallowClone(): EntityGroup<T> {
    return new EntityGroup([...this.entities])
  }

  deepClone(): EntityGroup<T> {
    return new EntityGroup(this.entities.map((entity) => entity.clone()))
  }

  clear(): void {
    this.entities.splice(0, this.entities.length)
  }

  includes(entity: Entity<any>): boolean {
    return this.entities.includes(entity)
  }

  // TODO: make a boolean for safety...
  remove(entity: Entity<any>) {
    this.entities.splice(this.entities.indexOf(entity), 1)
  }

  // $FlowFixMe
  [Symbol.iterator]() {
    return (function*(self: EntityGroup<T>): Generator<T, any, any> {
      yield* self.entities
    })(this)
  }
}
