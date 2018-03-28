import type { Component } from "../component"
import { Link } from 'react-router-dom'

export const PathSelection: Component<any> = props => {
    return <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alighItems: 'stretch',
    }}>
        <Link to={'/battle'}>Left</Link>
        <Link to={'/battle'}>Middle</Link>
        <Link to={'/battle'}>Right</Link>
    </div>
}