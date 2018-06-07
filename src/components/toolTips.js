import styled from "styled-components";
import { interpolate } from "../utils/textTemplate";
import { Effect, appearanceOf } from "../effects/effect";
import { Col, Block } from '../utility'

// TODO: if I make ToolTips an absolute postioned elem that takes up the space of the parent, it can automatically add the hover support and animate the tooltips



const ToolTipsStack = styled.div`
    display: none;
    position: absolute;
    left: 100%;
    top: 0;
    opacity: 0;
    flex-direction: column;
    align-items: stretch;
    flex-wrap: wrap;
    max-height: 700px;
    z-index: 3;
    transition: opacity 0.2s;
`

const ToolTipsWrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    &:hover ${ToolTipsStack} {
        display: flex;
        opacity: 1;
    }
    &:hover ${ToolTipsStack}:hover {
        display: none;
        opacity: 0;
    }
`

const ToolTipWrapper = Col.extend`
    width: 280px;
    text-align: left;
    font-size: 1.3rem;
    & p {
        margin: 6px 12px 6px;
    }
`

export const ToolTip = ({ effect }: { effect: Effect<any> }) => {
    let appearance = appearanceOf(effect)
    return appearance? <Block>
        <ToolTipWrapper>
            <p>
                <b>{ appearance.name + ': '}</b>
                { interpolate(appearance.description, effect) }
            </p>
        </ToolTipWrapper>
    </Block>: null
}

export const ToolTips = ({ effects }: { effects: Effect<>[] }) => {
    return <ToolTipsWrapper>
        <ToolTipsStack>
            { [...effects].map(effect => <ToolTip effect={ effect }/>) }
        </ToolTipsStack>
    </ToolTipsWrapper>
}