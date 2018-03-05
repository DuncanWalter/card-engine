import type { Effect as EffectObject } from "../../../engine/effects/effect"
import type { Component } from "../component";

type Props = {
    effect: EffectObject
}

export const Effect: Component<Props> = ({ effect }: Props) => {
    return <div style={sty.container}>
        <p>{effect.stacked ? effect.stacks : ''}</p>
    </div>
}


const sty = {
    container: { 
        flex: 1, 
        width:'35px', 
        height:'35px', 
        display:'flex',
        backgroundColor: '#332722',
        color:'#ffeedd', 
        borderRadius: '17px',
        justifyContent: 'center',
        alignItems: 'center',
    }
}