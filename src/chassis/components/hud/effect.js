import type { Effect as EffectObject } from "../../../engine/effects/effect"
import type { Component } from "../component";

type Props = {
    effect: EffectObject
}

export const Effect: Component<Props> = ({ effect }: Props) => {
    return <div style={renderData(effect).container}>
        <p>{effect.stacked ? effect.stacks : ''}</p>
    </div>
}


function renderData(effect: EffectObject){
    return {
        container: { 
            flex: 1, 
            width:'38px', 
            height:'38px', 
            display:'flex',
            border: `solid ${effect.appearance.outerColor} 2px`,
            backgroundColor: effect.appearance.innerColor,
            color:'#ffeedd', 
            borderRadius: '19px',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '3px',
        }
    }
}