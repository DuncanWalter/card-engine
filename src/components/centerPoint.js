import type { Component } from '../component'

// TODO: use styled component

const sty = { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: '-1500px',
    width: 0,
    height: 0,
    position: 'relative',
}

export const CenterPoint: Component<{ content: any }> = ({ content }) => 
    <div style={sty}>{ content }</div>