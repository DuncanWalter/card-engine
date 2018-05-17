import type { MonsterState, Monster } from "./monster"
import type { Game } from "../game/battle/battleState"
import type { Component } from "../component"
import { Event } from '../events/event'
import { EventResolver } from '../events/eventResolver'
import { synchronize } from "../utils/async"
import { Entity } from "../utils/entity";


export type BehaviorType = string

let types = (function*(){
    let i = 1
    while(i++){
        yield i.toString(26)
    }
})()

export interface Intent {
    damage?: number,
    numberOfAttacks?: number,
    isDefending?: boolean,
    isDebuffing?: boolean,
    isMajorDebuffing?: boolean,
    isBuffing?: boolean,
    isMiscBehavior?: boolean,
}

export interface BehaviorContext { 
    owner: Monster, 
    resolver: EventResolver, 
    game: $ReadOnly<Game>,
}

export interface BehaviorState {
    type: BehaviorType,
    name: string,
    // TODO:
    // description: string,
}

const definedBehaviors: Map<string, BehaviorContext => Promise<Intent>> = new Map()

export function defineBehavior<D>(name: string, behavior: BehaviorContext => Generator<any, Intent, any>): BehaviorType {
    
    // TODO: use the name, add a description formatter

    let { value, done } = types.next()

    if(value && !definedBehaviors.get(value)){
        definedBehaviors.set(value, synchronize(behavior))
    } else {
        throw new Error(`BehaviorType collision on ${name}.`)
    }
    
    return value

}


const baseIntent: Intent = { isMiscBehavior: true }

export class Behavior extends Entity<BehaviorState> {

    get type(): BehaviorType {
        return this.inner.type
    }
    
    get name(): string {
        return this.inner.name
    }

    // selectNext: (seed: number) => Behavior
    // perform: (ctx: BehaviorContext) => Promise<Intent>

    perform(context: BehaviorContext): Promise<Intent> {
        const behavior = definedBehaviors.get(this.type)
        if(behavior){
            return behavior(context)
        } else {
            throw new Error(`Unknown behavior type ${this.type}`)
        }
    }

    simulate(owner: Monster, resolver: EventResolver, game: $ReadOnly<Game>): Intent {
        let data: Intent = baseIntent
        resolver.simulate(resolver => {
            this.perform({ owner, resolver, game }).then(val => data = val)
        })
        if(data != baseIntent){
            return data
        } else {
            throw new Error(`Async detected in simulation of the behavior ${this.type}`)
        }
    }

}

type Props = {
    data: Intent
}

export const primeBehavior: BehaviorType = defineBehavior('PRIME_BEHAVIOR', function*(){ return {} })




















// TODO: needs a revamp
export const renderBehavior: Component<Props> = ({ data }) => {
    return <div style={renderData(data).container}>
        <p>{data.damage || ''}</p>
    </div>
}

function renderData(data: Intent){

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