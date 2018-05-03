import type { NPC } from "./npc"
import type { GameState } from "../game/battle/battleState"
import { Action } from "../actions/action"
import { ActionResolver } from "../actions/actionResolver"
import { synchronize } from "../utils/async"
import type { Component } from "../component"

export interface BehaviorData {
    damage?: number,
    isDefending?: boolean,
    isDebuffing?: boolean,
    isMajorDebuffing?: boolean,
    isBuffing?: boolean,
    isMiscBehavior?: boolean,
}

export interface BehaviorContext { 
    owner: NPC, 
    resolver: ActionResolver, 
    game: $ReadOnly<GameState> 
}

export class Behavior {

    name: string

    selectNext: (seed: number) => Behavior

    perform: (ctx: BehaviorContext) => Promise<BehaviorData>

    simulate(owner: NPC, resolver: ActionResolver, game: $ReadOnly<GameState>): BehaviorData {
        let data: BehaviorData = { isMiscBehavior: true }
        resolver.simulate(resolver => {
            this.perform({ owner, resolver, game }).then(val => data = val)
        })
        return data
    }

    next(owner: NPC): Behavior {
        const next = this.selectNext(owner.seed.value)
        owner.seed.value = owner.seed.generator.next()
        return next
    }

    constructor(
        name: string,
        selectNext: (seed: number) => Behavior,
        perform: ({ owner: NPC, resolver: ActionResolver, game: $ReadOnly<GameState> }) => BehaviorData | Generator<any, BehaviorData, any>,
    ){
        this.name = name
        this.selectNext = selectNext 
        this.perform = synchronize(perform, this)
    }

}



type Props = {
    data: BehaviorData
}

export const renderBehavior: Component<Props> = ({ data }) => {
    return <div style={renderData(data).container}>
        <p>{data.damage || ''}</p>
    </div>
}


function renderData(data: BehaviorData){

    let innerColor = '#00000', outerColor = '#ffffff'
    
    switch(true){
        case data.damage != undefined :{
            innerColor = '#996655'
            outerColor = '#ff7766'
            break
        }
        case data.isDefending:{
            innerColor = '#556699'
            outerColor = '#6677ff'
            break
        }
        case data.isDebuffing:{
            innerColor = '#669955'
            outerColor = '#77ff66'
            break
        }
        case data.isMajorDebuffing:{
            innerColor = '#771177'
            outerColor = '#992299'
            break
        }
        case data.isMiscBehavior:{
            innerColor = '#99aa11'
            outerColor = '#bbff22'
            break
        }
    }

    return {
        container: { 
            flex: 1, 
            width:'38px', 
            height:'38px', 
            display:'flex',
            border: `solid ${outerColor} 2px`,
            backgroundColor: innerColor,
            color:'#ffeedd', 
            borderRadius: '19px',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '3px',
        }
    }
}