import type { ListenerGroup } from '../events/listener'
import type { Game } from '../game/battle/battleState'
import { Entity, toExtractor } from '../utils/entity'
import { EventResolver } from '../events/eventResolver'
import { synchronize } from '../utils/async'
import { Listener } from '../events/listener'

export opaque type PragmaName = string

export interface PragmaState {
  name: PragmaName;
}

interface PragmaDefinition {
  acquire(args: AcquireArgs): Promise<void>;
  asListener(self: Pragma): ListenerGroup;
}

interface AcquireArgs {
  resolver: EventResolver;
  game: Game;
  self: Pragma;
}

const pragmaDefinitions: Map<PragmaName, PragmaDefinition> = new Map()

function pragmaName(name: string, def: PragmaDefinition): PragmaName {
  if (pragmaDefinitions.has(name)) {
    throw new Error(`Name collision on PragmaName ${name}`)
  } else {
    pragmaDefinitions.set(name, def)
    return name
  }
}

export class Pragma extends Entity<PragmaState, PragmaState> {
  get listener(): ListenerGroup {
    return this.definition.asListener(this)
  }

  get definition(): PragmaDefinition {
    const def = pragmaDefinitions.get(this.inner.name)
    if (def) {
      return def
    } else {
      throw new Error(`Pragma name ${this.inner.name} not registered.`)
    }
  }

  acquire(args: AcquireArgs): Promise<void> {
    return this.definition.acquire(args)
  }
}

export function definePragma(
  name: string,
  acquire: (args: AcquireArgs) => Generator<Promise<any>, void, any>,
  ...listenerFactories: ((self: Pragma) => Listener<any>)[]
): () => Pragma {
  const givenName = pragmaName(name, {
    acquire: synchronize(acquire),
    asListener: (owner) => listenerFactories.map((lf) => lf(owner)),
  })
  return function() {
    return new Pragma(
      {
        name: givenName,
      },
      toExtractor({})
    )
  }
}
