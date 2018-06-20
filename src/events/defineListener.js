import type { Header, Consumer, ListenerType, EventContent } from './listener'
import type { Tag } from './event'
import { resolver } from './eventResolver'
import { Listener } from './listener'
import { Entity } from '../utils/entity'

// TODO: make it a function w/ prop?
export type ListenerDefinition<T: EventContent, O: Entity<any>> = {
  type: ListenerType<T>,
} & ((owner: O) => Listener<T>)

export function defineListener<T: EventContent, O: Entity<any>>(
  type: string,
  header: (O) => Header<T>,
  consumer: (O, ListenerType<T>) => Consumer<T>,
  parents?: Tag[],
  children?: Tag[]
): ListenerDefinition<T, O> {
  const listenerType = resolver.registerListenerType(type, parents, children)

  const factory = function(owner) {
    return new Listener(
      listenerType,
      header(owner),
      consumer(owner, listenerType),
      false
    )
  }

  factory.type = listenerType

  return factory
}
