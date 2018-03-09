import { block as blockSymbol } from "../../../engine/effects/block"
import { GameState, gameSlice } from "../../../engine/gameState"
import type { Component } from "../component"
import { Effect } from "./effect"
import { NPC } from "../../../engine/creatures/npc";
import { Behavior } from "./behavior"
import { view } from "../../view";

type Props = {
    creature: Creature,
    isEnemy: boolean,
}

const game = gameSlice

export const Creature: Component<Props> = ({ isEnemy, creature }: Props) => {
    
    const { health, maxHealth, color } = creature

    const maybeBlock = creature.effects.filter(e => e.id == blockSymbol)[0]
    const block: number = maybeBlock ? maybeBlock.stacks : 0

    let behaviors = []
    if(creature instanceof NPC){
        behaviors.push(creature.behavior)
    }
    
    // TODO: display enemy intent
    return <div 
        style={sty.creature}
        onClick={e => view.dispatcher.clickFocus(creature)}
    >
        <div style={sty.effectBar}>
            {behaviors.map(b => <Behavior data={b.simulate(creature, game.resolver, game)}/>)}
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
        <div>{creature.constructor.name}</div>
        <div>{health}/{maxHealth}</div>
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