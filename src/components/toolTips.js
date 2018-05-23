import styled from "styled-components";
import { EffectGroup } from "../effects/effectGroup";
import { interpolate } from "../utils/textTemplate";
import { Effect } from "../effects/effect";
import { Col, Block } from '../utility'

// TODO: if I make ToolTips an absolute postioned elem that takes up the space of the parent, it can automatically add the hover support and animate the tooltips



const ToolTipsStack = styled.div`
    display: none;
    position: absolute;
    left: 100%;
    top: 0;
    flex-direction: column;
    align-items: stretch;
    flex-wrap: wrap;
    background-color: rgba(34, 34, 44, 0.32);
    max-height: 700px;
    z-index: 3;
`

const ToolTipsWrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    &:hover ${ToolTipsStack} {
        display: flex;
    }
`

const ToolTipWrapper = Col.extend`
    width: 420px;
    text-align: left;
    & p, & h4 {
        margin: 4px;
    }
`

export const ToolTip = ({ effect }: { effect: Effect }) => {
    let appearance = effect.appearance
    return appearance? <div>
        <ToolTipWrapper>
            <h4><b>{ appearance.name }</b></h4>
            <p>{ interpolate(appearance.description, effect) }</p>
        </ToolTipWrapper>
    </div>: null
}

export const ToolTips = ({ effects }: { effects: EffectGroup }) => {
    return <ToolTipsWrapper>
        <ToolTipsStack>
            { [...effects].map(effect => <ToolTip effect={ effect }/>) }
        </ToolTipsStack>
    </ToolTipsWrapper>
}