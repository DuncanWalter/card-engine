import type { BehaviorData } from "../../../engine/creatures/behavior"
import type { Component } from "../component"

type Props = {
    data: BehaviorData
}

export const Behavior: Component<Props> = ({ data }) => {
    return <div style={renderData(data).container}>
        <p>{data.damage || ''}</p>
    </div>
}


function renderData(data: BehaviorData){

    let innerColor = '#00000', outerColor = '#ffffff'
    
    switch(true){
        case data.damage != undefined :{
            innerColor = '#996655'
            outerColor = '#ff7766'
            break
        }
        case data.isDefending:{
            innerColor = '#556699'
            outerColor = '#6677ff'
            break
        }
        case data.isDebuffing:{
            innerColor = '#669955'
            outerColor = '#77ff66'
            break
        }
        case data.isMajorDebuffing:{
            innerColor = '#771177'
            outerColor = '#992299'
            break
        }
        case data.isMiscBehavior:{
            innerColor = '#99aa11'
            outerColor = '#bbff22'
            break
        }
    }

    return {
        container: { 
            flex: 1, 
            width:'38px', 
            height:'38px', 
            display:'flex',
            border: `solid ${outerColor} 2px`,
            backgroundColor: innerColor,
            color:'#ffeedd', 
            borderRadius: '19px',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '3px',
        }
    }
}