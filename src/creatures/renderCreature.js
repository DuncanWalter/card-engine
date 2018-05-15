import type { Component } from '../component'
import type { State } from '../state'
import { renderEffect as Effect } from '../effects/renderEffect'
import { renderBehavior as Behavior, Behavior as BehaviorWrapper } from './behavior'
import { Entity } from '../components/entity'
import { resolver } from '../events/eventResolver'
import { withState } from '../state';
import { Monster } from './monster';
import { Creature } from './creature';

type Props = { 
    creature: Creature<>,
    isEnemy: boolean,
    state: State,
}

function any(any: any): any { return any }

export const renderCreature: Component<Props> = withState(({ isEnemy, creature, state }: Props) => {
    
    const { health, inner } = creature
    const { maxHealth } = inner

    // TODO: put the block indicator back in
    // const maybeBlock = creature.effects.filter(e => e.id == blockSymbol)[0]
    const block: number = 0 // maybeBlock ? maybeBlock.stacks : 0

    let behaviors: BehaviorWrapper[] = []
    // TODO: previously used instanceof NPC
    if(creature instanceof Monster){
        behaviors.push(creature.behavior)
    }
    
    // TODO: display enemy intent
    return <Entity entity={creature}>
        <div style={sty.creature}>
            <div style={sty.effectBar}>{
                behaviors.map(b => 
                    <Behavior data={ b.simulate(any(creature), resolver, resolver.state.getGame()) }/>
                )
            }</div>
            <div style={{ backgroundColor: '#7777cc', ...sty.img }}/>
            <div style={sty.healthBar}>
                <div style={ sty.healthBarFill (health, block, maxHealth) }/>
                <div style={ sty.healthBarEmpty(health, block, maxHealth) }/>
                <div style={ sty.healthBarBlock(health, block, maxHealth) }/>
            </div>
            <div style={sty.effectBar}>
                {creature.effects.map(e => <Effect effect={e}/>)}
            </div>
            <div>{creature.inner.type}</div>
            <div>{health}/{maxHealth}</div>
        </div>
    </Entity>
})

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