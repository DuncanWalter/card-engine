import type { State } from "../../state";
import type { Reducer } from "../../utils/state"
import type { Card } from "../../cards/card"
import { createReducer } from "../../utils/state"
import { view } from "vitrarius"

interface HandState {
    cursor: {
        x: number,
        y: number,
    },
    dragging: boolean,
    anchor: {
        x: number,
        y: number,
    },
    cardSlots: CardSlot[],
    cardSprites: CardSprite[],
}

interface CardSlot {
    card: Card<>,
    pos: {
        x: number,
        y: number,
        // dx: number,
        // dy: number,
        a: number,
    },
    isActive: boolean,
    isDragging: boolean,
    isFocus: boolean,
}

interface CardSprite {
    pos: {
        x: number,
        y: number,
        // dx: number,
        // dy: number,
        a: number,
    },
    trg: {
        x: number,
        y: number,
        a: number,
    }
}

function targetLocation(isActive, isFocussed, index, handSize){
    
    let maxHandSize = 1600
    let handWidth = Math.min(maxHandSize, 240 * handSize)
    let centeredIndex = index - (handSize - 1) / 2
    let offset = handWidth * centeredIndex / (handSize + 1)
    let raise = isActive || isFocussed

    let angle = (handWidth / maxHandSize)*0.6*180/3.1415*Math.atan(centeredIndex/handSize)

    return {
        x: offset,
        y: 19 * (handWidth / maxHandSize * centeredIndex) ** 2 + (raise ? -150 : -35),
        a: angle,
    }
}

// TODO: how do I prevent this from updating twice in a single frame?
function easeTo(from, to, delta, speed){
    let dx = from.x - to.x
    let dy = from.y - to.y
    let dm = (dx**2 + dy**2)**0.5
    if(dm <= speed * delta){
        return to
    } else {
        return {
            x: from.x + (to.x - from.x) * speed * delta / dm,
            y: from.y + (to.y - from.y) * speed * delta / dm,
            a: 0,
        }
    }
}


export const handReducer: Reducer<HandState, any, State> = createReducer({
    setFocus: (state, data) => {
        if (state.dragging) return state
        return view('focus', () => data, state)
    },
    setCursor: (state, data) => /*console.log(data) ||*/ state,
    offFocus: (state, data) => {
        if (state.dragging) return state
        if (state.focus != data) return state
        return view('focus', () => null, state)
    },
    updateHand: (state, data, { battle, entity }) => {
        // TODO: tick it over a frame
        let visibleCards = [...battle.hand, ...battle.activeCards]

        let preservedSlots = state.cardSlots.filter(slot => {
            return visibleCards.indexOf(slot.card) >= 0
        }).map((slot, index) => {

            let subIndex = visibleCards.indexOf(slot.card)
            let card = visibleCards.splice(subIndex, 1, null)[0]

            // $FlowFixMe
            let isActive = battle.activeCards.has(card)
            let isDragging = false
            let isFocussed = entity.cursorFocus == card

            let target = targetLocation(isActive, isFocussed, index, visibleCards.length)

            let angle = target.a
            target = easeTo(slot.pos, target, 0.0166, 900)
            target.a = angle

            return {
                card,
                pos: target,
                isActive,
                isFocussed,
                isDragging,
            }
        })

        let newSlots = visibleCards.filter(card => card).map((card, subIndex) => {

            let index = preservedSlots.length + subIndex

            // $FlowFixMe
            let isActive = battle.activeCards.has(card)
            let isDragging = false
            let isFocussed = entity.cursorFocus == card

            let target = targetLocation(isActive, isFocussed, index, visibleCards.length)
            
            return {
                card,
                pos: target,
                isActive,
                isFocussed,
                isDragging,
            }
        })

        visibleCards = [...battle.hand, ...battle.activeCards]
        state.cardSprites.push(...state.cardSlots.filter(slot => {
            return visibleCards.indexOf(slot.card) < 0
        }).map(slot => {
            return {
                pos: {
                    x: slot.pos.x,
                    y: slot.pos.y,
                    // TODO: save the divide by zero case
                    a: 180/3.1415*Math.atan((-100 - slot.pos.y)/(1000 - slot.pos.x)),
                },
                trg: { x: 1000, y: -100, a: 0 },
            }
        }))

        let cardSprites = state.cardSprites.map(sprite => {
            return {
                pos: easeTo(sprite.pos, sprite.trg, 0.0166, 1100),
                trg: sprite.trg,
                a: 0,
            }
        }).filter(sprite => sprite.pos != sprite.trg)

        // if(cardSprites.length)console.log(cardSprites.length, cardSprites[0].pos)


        return {
            cursor: { x: Math.random(), y: 3 },
            dragging: false,
            anchor: state.anchor,
            cardSlots: [...preservedSlots, ...newSlots],
            cardSprites,
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
}

export function updateHand(dispatch: ({ type: string }) => void){
    dispatch({ type: 'updateHand' })
}