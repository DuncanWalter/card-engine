import type { State } from "../state";
import type { Reducer, Dispatch } from "../utils/state"
import { Component } from "preact"
import { resolver } from "../actions/actionResolver"
import { createReducer } from "../utils/state"
import { reducer, each } from "vitrarius"

interface EntityState {
    cursorFocus: any,
    queries: { filter: (any) => boolean, resolve: (any) => void }[],
}

export const entityReducer: Reducer<EntityState, any, State> = createReducer({
    setCursorFocus: reducer(({ target }) => 
        ['cursorFocus', val => target]
    ),
    unsetCursorFocus: reducer(({ target }) => 
        ['cursorFocus', val => val == target ? null : val]
    ),
    queryEntity: reducer(({ filter, resolve }) => 
        ['queries', queries => [...queries, { filter, resolve }]]
    ),
    eraseQuery: reducer(({ resolve }) => 
        ['queries', queries => queries.filter(query => query.resolve != resolve)]
    ),
    pushEntity: reducer(({ target }) => 
        ['queries', queries => queries.filter(query => 
            query.filter(target) ? query.resolve(target) && false : true
        )]
    ),
})

export const entityInitial: EntityState = {
    queries: [],
    cursorFocus: null,
}

export function queryEntity<T>(dispatch: Dispatch, filter: (target: Object) => boolean, resolve: (target: T) => void): () => void {
    dispatch({ 
        type: 'queryEntity',
        filter,
        resolve,
    })
    return () => dispatch({ type: 'eraseQuery', resolve })
}

