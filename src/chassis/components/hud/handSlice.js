import { createSlice } from "../../../core/state"
import { view } from 'vitrarius'


export const handSlice = createSlice('hand', {
    setFocus: (state, data) => {
        if (state.dragging) return state
        return view('focus', () => data, state)
    },
    setCursor: (state, data) => /*console.log(data) ||*/ state,
    offFocus: (state, data) => {
        if (state.dragging) return state
        if (state.focus != data) return state
        return view('focus', () => null, state)
    },
    update: (state, data) => {
        // TODO: tick it over a frame

        return state
    },
}, {
    cursor: {
        x: -1,
        y: -1,
    },
    focus: null,
    dragging: false,
    anchor: {
        x: -1,
        y: -1,
    },
    cardLocations: [],
})