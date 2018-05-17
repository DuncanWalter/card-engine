import type { Component } from '../component'
import type { Effect } from './effect'

type Props = { effect: Effect }
export const renderEffect: Component<Props> = ({ effect }: Props) => {
    let styles = renderData(effect)
    return styles ? <div style={styles.border}>
        <div style={styles.base}>
            <p>{effect.stacks  /* TODO: is Stacked check*/ }</p>
        </div>
    </div> : null
}

function renderData(effect: Effect){

    let a = effect.appearance
    if(!a)return
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
            // $FlowFixMe
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
            // $FlowFixMe
            backgroundColor: effect.appearance.outerColor,
        },
    }
}