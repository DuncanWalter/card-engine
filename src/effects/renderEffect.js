import type { Component } from '../component'
import type { Effect } from './effect'

type Props = { effect: Effect }
export const renderEffect: Component<Props> = ({ effect }: Props) => {
    let styles = renderData(effect)
    return <div style={styles.border}>
        <div style={styles.base}>
            <p>{effect.stacked ? effect.stacks : ''}</p>
        </div>
    </div>
}

function renderData(effect: Effect){

    let a = effect.appearance
    let seg = 2 * 3.1415 / a.sides
    let theta = seg * (a.rotation ? a.rotation : 0)
    let points = []
    
    while(points.length < a.sides){
        points.push(`${Math.round(50 + 50 * Math.sin(theta))}% ${Math.round(50 - 50 * Math.cos(theta))}%`)
        theta += seg
    }

    let poly = `polygon(${points.join(',')})`

    return {
        base: { 
            display: 'flex',
            backgroundColor: effect.appearance.innerColor,
            color:'#ffeedd', 
            justifyContent: 'center',
            alignItems: 'center',
            '-webkit-clip-path': poly,
            clipPath: poly,
            position: 'absolute',
            left: '3px',
            right: '3px',
            top: '3px',
            bottom: '3px',
        }, 
        border: {
            width:'38px', 
            height:'38px', 
            flex: 1, 
            position: 'relative',
            '-webkit-clip-path': poly,
            clipPath: poly,
            margin: '3px',
            backgroundColor: effect.appearance.outerColor,
        },
    }
}