import type {
  ListenerGroup,
  ListenerType,
  Header,
  Consumer,
} from '../events/listener'
import type { Creature } from '../creatures/creature'
import type { Card } from '../cards/card'
import type { ListenerDefinition } from '../events/defineListener'
import {
  Listener,
  ConsumerArgs,
  EventContent,
  deafListener,
} from '../events/listener'
import { startTurn, endTurn, type Tag } from '../events/event'
import { BindEffect } from '../events/bindEffect'
import { resolver } from '../events/eventResolver'
import { Entity } from '../utils/entity'
import { defineListener } from '../events/defineListener'

// TODO: put setters on stacks
// TODO: should be name, not type?

export opaque type EffectType: ListenerType<any> = ListenerType<any>

export interface Effect<+O: Card<> | Creature<> = any> {
  stacks: number;
  +type: EffectType;
}

interface StackBehavior {
  stacked: boolean;
  delta: (current: number) => number;
  min: number;
  max: number;
  on?: Tag;
}

interface Appearance {
  innerColor: string;
  outerColor: string;
  name: string;
  description: string;
  sides: number;
  rotation?: number;
}

interface EffectDefinition<O: Card<> | Creature<>> {
  stackBehavior: StackBehavior;
  appearance: Appearance | void | null;
  listenerFactory: (owner: O) => ListenerGroup;
  effectFactory: { type: EffectType, (stacks: number): Effect<any> };
}

const definedEffects: Map<string, EffectDefinition<any>> = new Map()

export const tick = resolver.registerListenerType(
  'tick',
  [{ type: startTurn }, { type: endTurn }],
  []
)

function definitionOf<O: *>(effect: Effect<O>): EffectDefinition<O> {
  const def = definedEffects.get(effect.type)
  if (def) {
    return def
  } else {
    throw new Error(`Unrecognized Effect type ${effect.type}`)
  }
}

export function appearanceOf<O: *>(
  effect: Effect<O>
): Appearance | void | null {
  const def = definedEffects.get(effect.type)
  if (def) {
    return def.appearance
  } else {
    return null
  }
}

export function toListener<O: *>(owner: O, effect: Effect<O>): ListenerGroup {
  let self = effect
  const def = definedEffects.get(self.type)
  if (def) {
    return [
      new Listener(
        tick,
        {
          subjects: [owner],
          type: def.stackBehavior.on || startTurn,
        },
        function*({ subject, resolver }) {
          const change = def.stackBehavior.delta(self.stacks) - self.stacks
          if (change) {
            resolver.pushEvents(
              BindEffect(
                owner,
                owner,
                {
                  Effect: def.effectFactory,
                  stacks: change,
                },
                { type: tick },
                def.effectFactory
              )
            )
          }
        },
        false
      ),
      def.listenerFactory(owner),
    ]
  } else {
    throw new Error(`Unrecognized Effect type ${self.type}`)
  }
}

export function defineEffect<T: EventContent, O: Creature<> | Card<>>(
  name: string,
  appearance: Appearance | void | null,
  stackBehavior: StackBehavior,
  header: (owner: O) => Header<T>,
  consumer: (owner: O, type: ListenerType<T>) => Consumer<T>,
  parents?: Tag[],
  children?: Tag[]
): { +type: EffectType, (stacks: number): Effect<O> } {
  const listener: ListenerDefinition<T, O> = defineListener(
    name,
    header,
    consumer,
    parents,
    children
  )

  const factory = function(stacks: number) {
    return {
      type: listener.type,
      stacks,
    }
  }

  factory.type = listener.type

  if (definedEffects.get(name)) {
    throw Error('ID collision on ' + name)
  }

  definedEffects.set(name, {
    appearance,
    stackBehavior,
    effectFactory: factory,
    listenerFactory: function(owner) {
      return new listener(owner)
    },
  })

  return factory
}

export function defineCompoundEffect<O: Creature<> | Card<>>(
  name: string,
  appearance: Appearance | void | null,
  stackBehavior: StackBehavior,
  ...listeners: ListenerDefinition<any, O>[]
): { +type: EffectType, (stacks: number): Effect<O> } {
  const type = resolver.registerListenerType(name)

  const factory = function(stacks) {
    return {
      type,
      stacks,
    }
  }

  factory.type = type

  if (definedEffects.get(name)) {
    throw Error('ID collision on ' + name)
  }

  definedEffects.set(name, {
    appearance,
    stackBehavior,
    effectFactory: factory,
    listenerFactory: function(owner) {
      return listeners.map((LD) => new LD(owner))
    },
  })

  return factory
}
