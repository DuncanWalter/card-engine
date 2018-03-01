import type { Effect as EffectObject } from "../../../engine/effects/effect"
import type { Component } from "../component";

type Props = {
    effect: EffectObject
}

export const Effect: Component<Props> = ({ effect }: Props) => {
    return <div style={{ flex: 1, width:'30px', height:'30px', backgroundColor:effect.color, display:'flex', color:'#ffeedd' }}>
        {effect.stacked ? effect.stacks : ''}
    </div>
}