import type { Component } from '../component'
import { Slice, createStore, createReducer } from "../utils/state";
import { overStream } from "./overStream";
import { h } from 'preact'

const { dispatch, stream } = createStore(state => {
    let time = Date.now()
    return {
        time,
        delta: (time - state.time) / 1000,
        hash: state.hash++ % 1024
    }
}, {
    time: Date.now(),
    delta: 17,
    hash: 0,
})

requestAnimationFrame(function loop(){ 
    dispatch({ type: '' })
    requestAnimationFrame(loop)
})

export const withAnimation = () => (component: Component<any>) => overStream(stream)(component)

// export const animated = (component: Component<any>) =>  