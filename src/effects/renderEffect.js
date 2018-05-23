import type { Effect } from './effect'
import { interpolate } from '../utils/textTemplate'
import styled from 'styled-components'
import { EffectGroup } from './effectGroup';
import { ToolTips } from '../components/toolTips';


const Wrapper = styled.div`
    position: relative;
    width: 38px;
    height: 38px;
    margin: 3px;
    background-color: ${ props =>
        props.appearance.outerColor
    };
`

const Body = styled.div`
    color:'#ffeedd';
    margin: 3px;
    background-color: ${ props =>
        props.appearance.innerColor
    };
`

type Props = { effect: Effect }
export const renderEffect = ({ effect }: Props) => {
    return effect.appearance? <Wrapper appearance={ effect.appearance }>
        <Body appearance={ effect.appearance }>
            { effect.stacks }
        </Body>
        {/* <ToolTips effects={ new EffectGroup([effect.id]) }/> */}
    </Wrapper>: null
    // let styles = renderData(effect)
    // return styles ? <div style={styles.border}>
    //     <div style={styles.base}> appearance={ effect.appearance }
    //         <p>{ effect.stacks /* TODO: is Stacked check*/ }</p>
    //     </div>
    // </div> : null
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

    let poly = `polygon(${ points.join(',') })`

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
