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
  margin: 4px;
  border: solid #44444f 2px;
  background: rgba(0, 0, 0, 0.18);
  border-radius: 12px;
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

const Fan = styled.div`
  flex-direction: row;
  justify-content: space-around;
  display: flex;
  max-width: 85%;
  align-items: center;
`

const CardHolder = styled.div`
  width: 280px;
  margin: 12px 12px 12px;
`

type CardPanelProps = {
  cards: CardO<>[],
  sets: string[],
  onClick?: (card: Card) => void,
}

export const CardFan = ({ cards, sets, onClick }: CardPanelProps) => (
  <Wrapper>
    <Canvas>
      <Fan>
        {cards.map((card) => (
          <CardHolder onClick={(click) => (onClick ? onClick(card) : null)}>
            <Card card={card} sets={sets} glow={false} />
          </CardHolder>
        ))}
      </Fan>
    </Canvas>
  </Wrapper>
)
