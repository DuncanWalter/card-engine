import type { State } from '../state'
import type { Reducer } from '../utils/state'
import type { CharacterName } from '../character'
import { Sequence, randomSequence } from "../utils/random"
import { createReducer } from "../utils/state"
import { reducer } from "vitrarius"

export interface MenuState {
    isSelecting: boolean,
    selectingIndex: number,
    character: string[],
    seed: number,
    previewing: string, 
    detailPanel: 'cards' | 'summary',
}

export const menuReducer: Reducer<MenuState, State> = createReducer({
    reset(slice, action, state){
        return {
            previewing: '',
            seed: Math.floor(Date.now() * Math.random() + 10000),
            character: ['Eve'],
            isSelecting: false,
            selectingIndex: -1,
            detailPanel: 'summary',
        }
    },
    beginSelectingCharacter(slice, { index }, state){
        return {
            ...slice,
            selectingIndex: index,
            isSelecting: true,
            previewing: slice.character[index],
        }
    },
    selectCharacter(slice){
        let c = [...slice.character]
        c[slice.selectingIndex] = slice.previewing
        return {
            ...slice,
            selectingIndex: -1,
            character: c,
            isSelecting: false,
            previewing: '',
        }
    },
    previewCharacter(slice, { character, /*cards or desc etc*/ }){
        return {
            ...slice,
            previewing: character,
        }
    },
    cancelCharacterSelection(slice){
        return {
            ...slice,
            isSelecting: false,
            selectingIndex: -1,
        }
    },
    viewDetailPanel(slice, { panel }){
        console.log(panel)
        return {
            ...slice,
            detailPanel: panel,
        }
    },
})

export const menuInitial: MenuState = {
    character: ['Adventurer'],
    seed: 0,
    isSelecting: false,
    selectingIndex: -1,
    previewing: '',
    detailPanel: 'summary',
}



export function reset(dispatch: (any) => void){
    dispatch({ type: 'reset' })
}

export function beginSelectingCharacter(dispatch: (any) => void, index: number){
    dispatch({ type: 'beginSelectingCharacter', index })
}

export function selectCharacter(dispatch: (any) => void){
    dispatch({ type: 'selectCharacter' })
}

export function previewCharacter(dispatch: (any) => void, character: CharacterName | void){
    dispatch({ type: 'previewCharacter', character: character || '' })
}



export function cancelCharacterSelection(){
    return {
        type: 'cancelCharacterSelection',
    }
}
export function viewDetailPanel(panel: 'cards' | 'summary'){
    return {
        type: 'viewDetailPanel',
        panel,
    }
}