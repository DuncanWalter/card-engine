import { Component } from "preact"
import { animationTimer } from "./withAnimation"
import { resolver } from "../actions/actionResolver"
import { Slice } from "../utils/state"
import { reducer, each } from "vitrarius"
import { createSlice } from "../utils/state"

export const entitySlice = createSlice({

    setCursorFocus: reducer(entity => 
        ['cursorFocus', val => entity]
    ),

    unsetCursorFocus: reducer(entity => 
        ['cursorFocus', val => val == entity ? null : val]
    ),

    queryEntity: reducer(({ filter, resolve }) => 
        ['queries', queries => [...queries, { filter, resolve }]]
    ),

    eraseQuery: reducer(({ resolve }) => 
        ['queries', queries => queries.filter(query => query.resolve != resolve)]
    ),

    pushEntity: reducer(entity => 
        ['queries', queries => queries.filter(query => 
            query.filter(entity) ? query.resolve(entity) && false : true
        )]
    ),

}, {
    queries: [],
    cursorFocus: null,
    positions: new Map(),
})

const dispatcher = entitySlice.dispatcher

export function queryEntity<T>(filter: (target: Object) => boolean, resolve: (target: T) => void): () => void {
    dispatcher.queryEntity({
        filter,
        resolve,
    })
    return () => dispatcher.eraseQuery(resolve)
}

export class Entity extends Component {
    
    state: {
        cache: any,
        lastTick: number,
        callback: (value: any) => any
    }

    onComponentDidMount(el: any): void {
        animationTimer.stream.onValue(this.state.callback)
        this.state = {
            lastTick: -1,
            cache: null,
            callback: value => setImmediate(() => this.setState({ value })),
        }
    }

    componentWillUnmount(){
        animationTimer.stream.offValue(this.state.callback)
    }

    render({ entity, children }: *){
        // TODO: animations currently disable entity operations
        let animations = resolver.animations.get(entity)
        if(animations){
            this.state.cache = [... animations].reduce((acc, ani) => 
                ani.update(animationTimer.state.delta, children)
            )
            return <div>{this.state.cache}</div>
        } else {
            return <div
                onClick={e => dispatcher.pushEntity(entity)}
                onMouseEnter={e => dispatcher.setCursorFocus(entity)}
                onMouseLeave={e => dispatcher.unsetCursorFocus(entity)}
            >{
                children
            }</div>
        }
    }
}









