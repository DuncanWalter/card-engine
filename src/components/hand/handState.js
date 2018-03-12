import { Slice } from "../../utils/state"
import { view as viewSlice } from '../../view'
import { gameSlice } from "../../gameState"
import { Card } from "../../cards/card"
import { view } from "vitrarius"
import { animationTimer } from "../utility/withAnimation";

const game = gameSlice.state
const viewState = viewSlice.state

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
    // console.log(delta, dx, dy)
    if(dm <= speed * delta){
        return to
    } else {
        return {
            x: from.x + (to.x - from.x) * speed * delta / dm,
            y: from.y + (to.y - from.y) * speed * delta / dm,
            a: from.a,
        }
    }
}


export const handSlice = new Slice({
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
    update: (state, data) => {
        // TODO: tick it over a frame

        let visableCards = game.hand.concat(game.activeCards)

        let preservedSlots = state.cardSlots.filter(slot => {
            return visableCards.indexOf(slot.card) >= 0
        }).map((slot, index) => {

            let subIndex = visableCards.indexOf(slot.card)
            let card = visableCards.splice(subIndex, 1, null)[0]

            let isActive = game.activeCards.indexOf(card) >= 0
            let isDragging = false
            let isFocussed = viewState.cursorFocus == card

            let target = targetLocation(isActive, isFocussed, index, visableCards.length)

            target = easeTo(slot.pos, target, animationTimer.state.delta, 900)

            return {
                card,
                pos: target,
                isActive,
                isFocussed,
                isDragging,
            }
        })

        let newSlots = visableCards.filter(card => card).map((card, subIndex) => {

            let index = preservedSlots.length + subIndex

            let isActive = game.activeCards.indexOf(card) >= 0
            let isDragging = false
            let isFocussed = viewState.cursorFocus == card

            let target = targetLocation(isActive, isFocussed, index, visableCards.length)
            
            return {
                card,
                pos: target,
                isActive,
                isFocussed,
                isDragging,
            }
        })

        visableCards = game.hand.concat(game.activeCards)
        state.cardSprites.push(...state.cardSlots.filter(slot => {
            return visableCards.indexOf(slot.card) < 0
        }).map(slot => {
            return {
                pos: {
                    x: slot.pos.x,
                    y: slot.pos.y,
                    // TODO: save the divide by zero case
                    a: 180/3.1415*Math.atan((-100 - slot.pos.y)/(1000 - slot.pos.x)),
                },
                trg: { x: 1000, y: -100 },
            }
        }))

        let cardSprites = state.cardSprites.map(sprite => {
            return {
                pos: easeTo(sprite.pos, sprite.trg, animationTimer.state.delta, 1100),
                trg: sprite.trg,
            }
        }).filter(sprite => sprite.pos != sprite.trg)

        if(cardSprites.length)console.log(cardSprites.length, cardSprites[0].pos)

        return {
            cursor: state.cursor,
            dragging: false,
            anchor: state.anchor,
            cardSlots: [...preservedSlots, ...newSlots],
            cardSprites,
        }
    },
}, {
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
})