import type { State } from '../state'
import { withState } from '../state'
import { Row, Block, Shim } from '../utility'
import { Card } from '../cards/component'
import { Card as CardO } from '../cards/card'
import styled from 'styled-components'
import React from 'react'

// TODO: clean up styles

const Wrapper = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  flex: 1;
  box-shadow: inset 0 4px 16px rgba(0, 0, 0, 0.35),
    inset 0 0 8px rgba(0, 0, 0, 0.35);
  margin: 12px;
  background: rgba(0, 0, 0, 0.18);
  border-radius: 4px;
`

const Canvas = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  flex-direction: row;
  display: flex;
  justify-content: center;
`

const Panel = styled.div`
  flex-wrap: wrap;
  justify-content: center;
  display: flex;
  max-width: 85%;
  padding: 12px;
`

const CardHolder = styled.div`
  width: 280px;
  margin: 12px;
`

type CardPanelProps = {
  state: State,
  cards: CardO<>[],
  sets: string[],
  onClick?: (card: Card) => void,
}

const CardPanelInner = ({ state, cards, sets, onClick }: CardPanelProps) => (
  <Wrapper>
    <Canvas>
      <Panel>
        {cards.map((card) => (
          <CardHolder onClick={(click) => (onClick ? onClick(card) : null)}>
            <Card card={card} sets={sets} glow={false} />
          </CardHolder>
        ))}
        <CardHolder />
        <CardHolder />
        <CardHolder />
        <CardHolder />
        <CardHolder />
        <CardHolder />
      </Panel>
    </Canvas>
  </Wrapper>
)

export const CardPanel = withState(CardPanelInner)
