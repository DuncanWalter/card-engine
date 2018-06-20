import { Card } from '../../cards/component'
import { Card as CardObject } from './../../cards/card'
import {
  updateHand,
  setFocus,
  unsetFocus,
  CardSlot as CardSlotT,
  findCardById,
} from './handState'
import { withAnimation } from '../../components/withAnimation'
import { CenterPoint } from '../../components/centerPoint'
import { Transform } from '../../components/transform'
import { dispatch, withState, stream } from '../../state'
import { resolver } from '../../events/eventResolver'
import { PlayCard } from '../../events/playCard'
import { Shim } from '../../utility'
import { submitTarget } from '../combatState'
import { Game, withGame } from '../battle/battleState'
import React from 'react'

const sty = {
  hand: {
    display: 'flex',
    flexDirection: 'row',
    height: 0,
    // TODO: align items end/bottom in this case
  },
}

type CardSlotProps = { slot: CardSlotT, game: Game }
const CardSlot = withGame(({ slot, game }: CardSlotProps) => {
  // TODO: snag the legitimate Card
  const isFocus = slot.isFocus
  const card = findCardById(game, slot.card)

  if (!card) {
    return
  }

  return (
    <Transform
      x={slot.pos.x}
      y={isFocus ? -220 : slot.pos.y}
      a={isFocus ? 0 : slot.pos.a}
      style={{ zIndex: isFocus ? 3 : 'auto' }}
    >
      <CenterPoint
        content={
          <div
            onClick={(click) => dispatch(submitTarget(card.id))}
            onMouseEnter={(click) => dispatch(setFocus(card.id))}
            onMouseLeave={(click) => dispatch(unsetFocus(card.id))}
          >
            <Card
              glow={isFocus}
              card={card}
              sets={game.player.sets}
              playEnergy={game.player.energy}
            />
          </div>
        }
      />
    </Transform>
  )
})

export const Hand = withGame(
  withState(
    withAnimation(({ game, state, delta }) => {
      // TODO: move on animation frame crap into the with animation hoc props
      dispatch(updateHand(game, 0.0166))
      return (
        <div style={sty.hand}>
          <Shim />
          <div style={{ width: 0, height: 0 }}>
            {[...state.hand.cardSlots.map((slot) => <CardSlot slot={slot} />)]}
          </div>
          <Shim />
        </div>
      )
    })
  )
)
