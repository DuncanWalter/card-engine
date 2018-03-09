import { createSlice } from "../core/state";
import { view as vitView } from 'vitrarius'

export const view = createSlice('view', {
    setCursorFocus(state, data){
        return vitView('cursorFocus', val => data, state)
    },
    unsetCursorFocus(state, data){
        return vitView('cursorFocus', val => val == data ? null : val, state)
    },
    queryTarget(state, data){  
        return vitView('targeting', ({ isTargeting }) => {
            if (isTargeting) throw new Error('multiple target requests up at once')
            return { 
                isTargeting: true,
                resolve: data.resolve,
                filter: data.filter,
            }
        }, state)
    },
    clickFocus(state, data){
        return vitView('targeting', t => {
            console.log('got to the clickFocus state resolver')
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
    view.dispatcher.queryTarget({
        filter,
        resolve,
    })
}

// export function clickFocus(focus: Object){
//     view.dispatcher.clickFocus(focus)
// }

