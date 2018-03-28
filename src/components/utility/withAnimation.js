import type { Component } from '../component'
import { Slice } from "../../utils/state";
import { overStream } from "./overStream";
import { h } from 'preact'


export const animationTimer = new Slice({
    tick: state => {
        let time = Date.now()
        return {
            time,
            delta: (time - state.time) / 1000,
            hash: state.hash++ % 1024
        }
    }
}, {
    time: Date.now(),
    delta: 17,
    hash: 0,
})

requestAnimationFrame(function loop(){ 
    animationTimer.dispatcher.tick()
    requestAnimationFrame(loop)
})

export const withAnimation = (name: string) => (component: Component<>) => overStream(animationTimer.stream, name)(component)