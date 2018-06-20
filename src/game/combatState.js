import type { ID } from '../utils/entity'
import type { CreatureState, Creature } from '../creatures/creature'
import { createReducer } from '../utils/state'

export interface CombatState {
  queries: {
    [id: string]: {
      id: string,
      submissions: mixed[],
    },
  };
  focus: ID<CreatureState> | void;
}

export const combatReducer = createReducer({
  setCombatFocus(slice: CombatState, { creature }) {
    if (creature.id == slice.focus) {
      return slice
    } else {
      return {
        ...slice,
        focus: creature.id,
      }
    }
  },
  unsetCombatFocus(slice: CombatState, { creature }) {
    if (slice.focus == creature.id) {
      return {
        ...slice,
        focus: undefined,
      }
    } else {
      return slice
    }
  },
  rejectTargets(slice: CombatState, { id, targets }): CombatState {
    return {
      ...slice,
      queries: Object.keys(slice.queries).reduce((acc, key) => {
        if (slice.queries[key].id == id) {
          acc[key] = {
            ...slice.queries[id],
            submissions: slice.queries[key].submissions.filter(
              (sub) => !targets.includes(sub)
            ),
          }
        } else {
          acc[key] = slice.queries[key]
        }
        return acc
      }, {}),
    }
  },
  submitTarget(slice: CombatState, { entry }): CombatState {
    return {
      ...slice,
      queries: Object.keys(slice.queries).reduce((acc, key) => {
        acc[key] = {
          ...slice.queries[key],
          submissions: [...slice.queries[key].submissions, entry],
        }
        return acc
      }, {}),
    }
  },
  collectTargets(slice: CombatState, { id }): CombatState {
    const ret = {
      ...slice,
      queries: {
        ...slice.queries,
      },
    }
    delete ret.queries[id]
    return ret
  },
  queryTargets(slice: CombatState, { id }): CombatState {
    let ret = {
      ...slice,
      queries: {
        ...slice.queries,
        [id]: {
          id,
          submissions: [],
        },
      },
    }
    return ret
  },
})

export const combatInitial: CombatState = {
  // $FlowFixMe
  queries: {},
  focus: undefined,
}

export function rejectTargets(id: string, targets: mixed[]) {
  return {
    type: 'rejectTargets',
    id,
    targets,
  }
}

export function submitTarget(entry: mixed) {
  return {
    type: 'submitTarget',
    entry,
  }
}

export function collectTargets(id: string) {
  return {
    type: 'collectTargets',
    id,
  }
}

export function queryTargets(id: string) {
  return {
    type: 'queryTargets',
    id,
  }
}

export function setFocus(creature: Creature<>) {
  return {
    type: 'setCombatFocus',
    creature,
  }
}

export function unsetFocus(creature: Creature<>) {
  return {
    type: 'unsetCombatFocus',
    creature,
  }
}
