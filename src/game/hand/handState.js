import type { State } from '../../state'
import type { Reducer } from '../../utils/state'
import { createReducer } from '../../utils/state'
import { CardState, Card } from '../../cards/card'
import { type ID } from '../../utils/entity'
import { Game, withGame } from '../battle/battleState'
import { CardStack } from '../../cards/cardStack'

export interface HandState {
  focus: ID<CardState<>> | void;
  cursor: {
    x: number,
    y: number,
  };
  dragging: boolean;
  anchor: {
    x: number,
    y: number,
  };
  cardSlots: CardSlot[];
  // cardSprites: CardSprite[],
}

export interface CardSlot {
  card: ID<CardState<>>;
  cardState: CardState<>;
  pos: {
    x: number,
    y: number,
    a: number,
  };
  isActive: boolean;
  isDragging: boolean;
  isFocus: boolean;
}

interface CardSprite {
  pos: {
    x: number,
    y: number,
    a: number,
  };
  trg: {
    x: number,
    y: number,
    a: number,
  };
}

function targetLocation(isActive, isFocussed, index, handSize) {
  let maxHandSize = 1600
  let handWidth = Math.min(maxHandSize, 240 * handSize)
  let centeredIndex = index - (handSize - 1) / 2
  let offset = (handWidth * centeredIndex) / (handSize + 1)
  let raise = isActive || isFocussed

  let angle =
    (((handWidth / maxHandSize) * 0.6 * 180) / 3.1415) *
    Math.atan(centeredIndex / handSize)

  return {
    x: offset,
    y:
      19 * ((handWidth / maxHandSize) * centeredIndex) ** 2 +
      (raise ? -180 : -65),
    a: angle,
  }
}

function easeTo(from, to, delta, speed) {
  let dx = from.x - to.x
  let dy = from.y - to.y
  let dm = (dx ** 2 + dy ** 2) ** 0.5
  if (dm <= speed * delta) {
    return to
  } else {
    return {
      x: from.x + ((to.x - from.x) * speed * delta) / dm,
      y: from.y + ((to.y - from.y) * speed * delta) / dm,
      a: 0,
    }
  }
}

export const handReducer: Reducer<HandState, State> = createReducer({
  setFocus(slice: HandState, { focus }, { battle }: State) {
    if (focus == slice.focus) {
      return slice
    } else {
      return {
        ...slice,
        focus,
      }
    }
  },
  unsetFocus(slice: HandState, { focus }, { battle }: State) {
    if (focus == slice.focus) {
      return {
        ...slice,
        focus: undefined,
      }
    } else {
      return slice
    }
  },
  updateHand: (
    slice: HandState,
    { game, delta }: { game: Game, delta: number }
  ) => {
    let slots = [...slice.cardSlots]
    const slottedIds = slots.map((slot) => slot.card)

    const visibleCards = [...game.hand, ...game.activeCards]
    const visibleIds = visibleCards.map((card) => card.id)

    const activeIds = [...game.activeCards].map((card) => card.id)

    // First, add any cards appearing in the hand
    const newSlotIds = visibleCards
      .map((card) => card.id)
      .filter((id) => !slottedIds.includes(id))
    slots.push(
      ...newSlotIds.map((id, index) => {
        const isActive = activeIds.includes(id)
        const isFocus = id == slice.focus
        return {
          card: id,
          cardState: any(undefined),
          pos: targetLocation(
            isActive,
            isFocus,
            index + slottedIds.length,
            newSlotIds.length + slottedIds.length
          ),
          isActive,
          isDragging: false,
          isFocus,
        }
      })
    )

    // Then remove cards which are no longer visible
    slots = slots.filter((slot) => visibleIds.includes(slot.card))

    // Then determine real target locations
    slots.forEach((slot: CardSlot, index) => {
      const target = targetLocation(
        slot.isActive,
        slot.isFocus,
        index,
        slots.length
      )
      slot.pos = easeTo(slot.pos, target, delta, 900)
      slot.isFocus = slot.card == slice.focus
      slot.isActive = activeIds.includes(slot.card)

      const card: Card<> = visibleCards[visibleIds.indexOf(slot.card)]

      slot.cardState = {
        type: card.type,
        data: card.data,
        effects: card.effects,
        appearance: card.appearance,
      }
    })

    return {
      cursor: { x: 0, y: 0 },
      dragging: false,
      anchor: slice.anchor,
      cardSlots: slots,
      focus: slice.focus,
    }
  },
})

export const handInitial: HandState = {
  cursor: {
    x: -1,
    y: -1,
  },
  dragging: false,
  anchor: {
    x: -1,
    y: -1,
  },
  cardSlots: [],
  cardSprites: [],
  focus: undefined,
}

export function updateHand(game: Game, delta: number) {
  return { type: 'updateHand', game, delta }
}

export function setFocus(card: ID<CardState<>>) {
  return {
    type: 'setFocus',
    focus: card,
  }
}

export function unsetFocus(card: ID<CardState<>>) {
  return {
    type: 'unsetFocus',
    focus: card,
  }
}

function any(any: any): any {
  return any
}

export function findCardById(game: Game, id: ID<CardState<>>): Card<> | void {
  return [...game.activeCards, ...game.hand].filter((card) => card.id == id)[0]
}
