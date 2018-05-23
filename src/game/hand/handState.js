import type { State } from "../../state";
import type { Reducer } from "../../utils/state"
import { createReducer } from "../../utils/state"
import { CardState, Card } from "../../cards/card";
import { type ID } from '../../utils/entity'

export interface HandState {
    focus: ID<CardState<>> | void,
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
    // cardSprites: CardSprite[],
}

export interface CardSlot {
    card: ID<CardState<>>,
    pos: {
        x: number,
        y: number,
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
        y: 19 * (handWidth / maxHandSize * centeredIndex) ** 2 + (raise ? -180 : -65),
        a: angle,
    }
}

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


export const handReducer: Reducer<HandState, State> = createReducer({
    setFocus(slice: HandState, { focus }, { battle }: State){
        if(focus.id == slice.focus){
            return slice
        } else {
            return {
                ...slice,
                focus: focus.id,
            }
        }
    },
    unsetFocus(slice: HandState, { focus }, { battle }: State){
        if(focus.id == slice.focus){
            return {
                ...slice,
                focus: undefined,
            }
        } else {
            return slice
        }
    },
    updateHand: (slice: HandState, data, { battle }: State) => {
        let visibleCards: ID<CardState<>>[] = [...battle.hand, ...battle.activeCards]

        let preservedSlots = slice.cardSlots.filter(slot => {
            return new Card(slot.card).indexIn(visibleCards) >= 0
        }).map((slot, index) => {

            let card = visibleCards[visibleCards.indexOf(slot.card)]

            let isActive = new Card(card).indexIn(battle.activeCards) >= 0
            let isDragging = false
            let isFocus = slice.focus == slot.card

            let target = targetLocation(isActive, isFocus, index, visibleCards.length)

            let angle = target.a
            target = easeTo(slot.pos, target, 0.0166, 900)
            target.a = angle

            return {
                card,
                pos: target,
                isActive,
                isFocus,
                isDragging,
            }
        })

        let newSlots = visibleCards.filter(card => 
            !preservedSlots.filter(slot => slot.card == card).length 
        ).map((card, subIndex) => {

            let index = preservedSlots.length + subIndex

            let isActive = new Card(card).indexIn(battle.activeCards) >= 0
            let isDragging = false
            let isFocus = card == slice.focus

            let target = targetLocation(isActive, isFocus, index, visibleCards.length)
            
            return {
                card,
                pos: target,
                isActive,
                isFocus,
                isDragging,
            }
        })

        // visibleCards = [...battle.hand, ...battle.activeCards]
        // slice.cardSprites.push(...slice.cardSlots.filter(slot => {
        //     return visibleCards.indexOf(slot.card) < 0
        // }).map(slot => {
        //     return {
        //         pos: {
        //             x: slot.pos.x,
        //             y: slot.pos.y,
        //             // TODO: save the divide by zero case
        //             a: 180/3.1415*Math.atan((-100 - slot.pos.y)/(1000 - slot.pos.x)),
        //         },
        //         trg: { x: 1000, y: -100, a: 0 },
        //     }
        // }))

        // let cardSprites = slice.cardSprites.map(sprite => {
        //     return {
        //         pos: easeTo(sprite.pos, sprite.trg, 0.0166, 1100),
        //         trg: sprite.trg,
        //         a: 0,
        //     }
        // }).filter(sprite => sprite.pos != sprite.trg)


        return {
            cursor: { x: Math.random(), y: 3 },
            dragging: false,
            anchor: slice.anchor,
            cardSlots: [...preservedSlots, ...newSlots],
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

export function updateHand(){
    return { type: 'updateHand' }
}

export function setFocus(card: Card<>){
    return {
        type: 'setFocus',
        focus: card,
    }
}

export function unsetFocus(card: Card<>){
    return {
        type: 'unsetFocus',
        focus: card,
    }
}