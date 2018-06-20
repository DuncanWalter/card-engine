import type { MonsterState, Monster } from './monster'
import type { Game } from '../game/battle/battleState'
import { Event } from '../events/event'
import { EventResolver } from '../events/eventResolver'
import { synchronize } from '../utils/async'
import { Entity } from '../utils/entity'
import React from 'react'

export interface Intent {
  damage?: number;
  numberOfAttacks?: number;
  isDefending?: boolean;
  isDebuffing?: boolean;
  isMajorDebuffing?: boolean;
  isBuffing?: boolean;
  isMiscBehavior?: boolean;
}

export interface BehaviorContext {
  owner: Monster;
  resolver: EventResolver;
  game: $ReadOnly<Game>;
}

export type BehaviorState = string

const definedBehaviors: Map<
  string,
  (BehaviorContext) => Promise<Intent>
> = new Map()

export function defineBehavior<D>(
  name: string,
  behavior: (BehaviorContext) => Generator<any, Intent, any>
): BehaviorState {
  if (!definedBehaviors.get(name)) {
    definedBehaviors.set(name, synchronize(behavior))
  } else {
    throw new Error(`BehaviorType collision on ${name}.`)
  }

  return name
}

const baseIntent: Intent = { isMiscBehavior: true }

export class Behavior {
  inner: BehaviorState

  get name(): string {
    return this.inner
  }

  perform(context: BehaviorContext): Promise<Intent> {
    const behavior = definedBehaviors.get(this.inner)
    if (behavior) {
      return behavior(context)
    } else {
      throw new Error(`Unknown behavior type ${this.inner}`)
    }
  }

  simulate(owner: Monster, resolver: EventResolver): Intent {
    let data: Intent = baseIntent
    resolver.simulate((resolver, game) => {
      this.perform({ owner, resolver, game }).then((val) => (data = val))
    })
    if (data != baseIntent) {
      return data
    } else {
      throw new Error(
        `Async detected in simulation of the behavior ${this.inner}`
      )
    }
  }

  unwrap(): BehaviorState {
    return this.inner
  }

  // is(other: BehaviorState | Behavior): boolean {
  //     return this.inner == other || this.inner == other.inner
  // }

  constructor(state: BehaviorState) {
    this.inner = state
  }
}

type Props = {
  data: Intent,
}

export const primeBehavior: BehaviorState = defineBehavior(
  'PRIME_BEHAVIOR',
  function*() {
    return {}
  }
)

// TODO: needs a revamp
export const renderBehavior = ({ data }: { data: Intent }) => {
  return (
    <div style={renderData(data).container}>
      <p>{data.damage || ''}</p>
    </div>
  )
}

function renderData(data: Intent) {
  let innerColor = '#000000',
    outerColor = '#ffffff'

  switch (true) {
    case data.damage != undefined: {
      innerColor = '#996655'
      outerColor = '#ff7766'
      break
    }
    case data.isDefending: {
      innerColor = '#556699'
      outerColor = '#6677ff'
      break
    }
    case data.isDebuffing: {
      innerColor = '#669955'
      outerColor = '#77ff66'
      break
    }
    case data.isMajorDebuffing: {
      innerColor = '#771177'
      outerColor = '#992299'
      break
    }
    case data.isMiscBehavior: {
      innerColor = '#99aa11'
      outerColor = '#bbff22'
      break
    }
  }

  return {
    container: {
      flex: 1,
      width: '38px',
      height: '38px',
      display: 'flex',
      border: `solid ${outerColor} 2px`,
      backgroundColor: innerColor,
      color: '#ffeedd',
      borderRadius: '19px',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '3px',
    },
  }
}
