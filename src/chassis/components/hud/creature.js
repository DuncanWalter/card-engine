import { block as blockSymbol } from "../../../engine/effects/block"
import { GameState } from "../../../engine/gameState"
import type { Component } from "../component"
import { Effect } from "./effect"

type Props = {
    creature: Creature,
    game: $ReadOnly<GameState>,
}

export const Creature: Component<Props> = ({ game, creature }: Props) => {
    
    const { health, maxHealth, color } = creature
    const maybeBlock = creature.effects.filter(e => e.id == blockSymbol)[0]
    const block = maybeBlock ? maybeBlock.stacks : 0
    
    // TODO: display enemy intent
    return <div style={sty.creature}>
        <div style={sty.effectBar}>
            
        </div>
        <div style={{ backgroundColor: color, ...sty.img }}/>
        <div style={sty.healthBar}>
            <div style={sty.healthBarFill(health, block, maxHealth)}/>
            <div style={sty.healthBarEmpty(health, block, maxHealth)}/>
            <div style={sty.healthBarBlock(health, block, maxHealth)}/>
        </div>
        <div style={sty.effectBar}>
            {creature.effects.map(e => <Effect effect={e}/>)}
        </div>
    </div>
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
        height: '16px',
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
        height: '30px',
    },
}