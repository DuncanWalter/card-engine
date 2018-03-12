
import type { Component } from '../component'

export const Transform: Component<{ content: any, position: any, rotation?: number }> = ({ position, content }) => {
    return <div style={ process(position) }>{ content }</div>
}

function process(position){
    return {
        position: 'relative',
        transform: `translate(${position.x}px, ${position.y}px) rotate(${ position.a }deg)`,
    }
}