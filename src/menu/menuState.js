import type { State } from '../state'
import type { Reducer } from '../utils/state'
import type { CharacterName } from '../character'
import { Sequence, randomSequence } from '../utils/random'
import { createReducer } from '../utils/state'
import { reducer } from 'vitrarius'
import React from 'react'

export interface MenuState {
  character: string[];
  seed: number;
}

export const menuReducer: Reducer<MenuState, State> = createReducer({
  reset(slice, action, state) {
    return {
      seed: Math.floor(Date.now() * Math.random() + 10000),
      character: ['Eve', '', ''],
    }
  },
  setCharacter(slice, { name, index }) {
    let character = [...slice.character]
    character[index] = name
    return {
      ...slice,
      character,
    }
  },
})

export const menuInitial: MenuState = {
  character: ['Adventurer', '', ''],
  seed: 0,
}

export function reset() {
  return {
    type: 'reset',
  }
}
export function setCharacter(name: CharacterName, index: number) {
  return {
    type: 'setCharacter',
    name,
    index,
  }
}
