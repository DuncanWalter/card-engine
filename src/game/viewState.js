import { Slice } from "../utils/state"
import { view } from 'vitrarius'

export const { state, dispatcher, stream } = new Slice({
    setCursorFocus(state, data){
        // console.log('Yay')
        return view('cursorFocus', val => data, state)
    },
    unsetCursorFocus(state, data){
        // console.log('YIPPIE')
        return view('cursorFocus', val => val == data ? null : val, state)
    },
    queryTarget(state, data){  
        return view('targeting', ({ isTargeting }) => {
            if (isTargeting) throw new Error('multiple target requests up at once')
            return { 
                isTargeting: true,
                resolve: data.resolve,
                filter: data.filter,
            }
        }, state)
    },
    clickFocus(state, data){
        return view('targeting', t => {
            if(t.isTargeting && t.filter(data)){
                t.resolve(data)
                return { isTargeting: false }
            } else {
                return t
            }
        }, state)
    },

}, {
    controlsActive: true,
    targeting: {
        isTargeting: false,
        resolve: undefined,
        filter: undefined,
    },
    cursorFocus: null,
})

export function queryTarget<T>(filter: (target: Object) => boolean, resolve: (target: T) => void){
    dispatcher.queryTarget({
        filter,
        resolve,
    })
}

// export function clickFocus(focus: Object){
//     view.dispatcher.clickFocus(focus)
// }

