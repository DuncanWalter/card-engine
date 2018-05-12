import type { Component } from '../component'
import type { CreatureWrapper } from './creature'
import type { State } from '../state'
import { renderEffect as Effect } from '../effects/renderEffect'
import { renderBehavior as Behavior, Behavior as BehaviorT } from './behavior'
import { Entity } from '../components/entity'
import { resolver } from '../actions/actionResolver'
import { withState } from '../state';
import { MonsterWrapper } from './monster';

type Props = { 
    creature: CreatureWrapper<>,
    isEnemy: boolean,
    state: State,
}

export const renderCreature: Component<Props> = withState(({ isEnemy, creature, state }: Props) => {
    
    const { health, inner } = creature
    const { maxHealth } = inner

    // TODO: put the block indicator back in
    // const maybeBlock = creature.effects.filter(e => e.id == blockSymbol)[0]
    const block: number = 0 // maybeBlock ? maybeBlock.stacks : 0

    let behaviors: BehaviorT[] = []
    // TODO: previously used instanceof NPC
    if(creature instanceof MonsterWrapper){
        behaviors.push(creature.inner.data.behavior)
    }
    
    // TODO: display enemy intent
    return <Entity entity={creature}>
        <div style={sty.creature}>
            <div style={sty.effectBar}>{
                behaviors.map(b => 
                    // $FlowFixMe
                    <Behavior data={ b.simulate(creature, resolver, state.battle) }/>
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
            <div>{creature.constructor.name}</div>
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