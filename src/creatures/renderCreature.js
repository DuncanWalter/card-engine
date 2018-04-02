import type { Component } from '../component'
import type { Creature } from './creature'
import { renderEffect as Effect } from '../effects/renderEffect'
import { renderBehavior as Behavior, Behavior as BehaviorT } from './behavior'
import { dispatcher } from '../game/viewState'
import { Entity } from '../components/entity'
import { resolver } from '../actions/actionResolver'
import { state as battle } from '../game/battle/battleState'

type Props = {
    creature: Creature,
    isEnemy: boolean,
}

export const renderCreature: Component<Props> = ({ isEnemy, creature }: Props) => {
    
    const { health, maxHealth, color } = creature

    // TODO: put the block indicator back in
    // const maybeBlock = creature.effects.filter(e => e.id == blockSymbol)[0]
    const block: number = 0 // maybeBlock ? maybeBlock.stacks : 0

    let behaviors: BehaviorT[] = []
    // TODO: previously used instanceof NPC
    if(creature.behavior){
        behaviors.push(creature.behavior)
    }

    console.log(creature)
    
    // TODO: display enemy intent
    return <Entity entity={creature}>
        <div 
            style={sty.creature}
            onClick={e => dispatcher.clickFocus(creature)}
        >
            <div style={sty.effectBar}>{
                behaviors.map(b => 
                    <Behavior data={ b.simulate(creature, resolver, battle) }/>
                )
            }</div>
            <div style={{ backgroundColor: color, ...sty.img }}/>
            <div style={sty.healthBar}>
                <div style={ sty.healthBarFill (health, block, maxHealth) }/>
                <div style={ sty.healthBarEmpty(health, block, maxHealth) }/>
                <div style={ sty.healthBarBlock(health, block, maxHealth) }/>
            </div>
            <div style={sty.effectBar}>
                {creature.effects.map(e => <Effect effect={e}/>)}
            </div>
            <div>{creature.constructor.name}</div>
            <div>{health}/{maxHealth}</div>
        </div>
    </Entity>
}

const sty = {
    creature: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    img: {
        width: '250px',
        height: '250px',
        borderRadius: '125px',
        margins: '10px',
    },
    healthBar: {
        display: 'flex',
        flexDirection: 'horizontal',
        width: '400px',
        height: '17px',
    },
    healthBarFill(current, block, max){
        return {
            flex: current,
            backgroundColor: '#ff1111',
        }
    },
    healthBarEmpty(current, block, max){
        return {
            flex: max - current,
            backgroundColor: '#441515',
        }
    },
    healthBarBlock(current, block, max){
        return {
            flex: block,
            backgroundColor: '#2266aa',
        }
    },
    effectBar: {
        display: 'flex',
        flexDirection: 'row',
        height: '44px',
    },
}