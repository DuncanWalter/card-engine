import type { State } from '../state'
import { renderEffect as Effect } from '../effects/renderEffect'
import {
  renderBehavior as Behavior,
  Behavior as BehaviorWrapper,
} from './behavior'
import { resolver } from '../events/eventResolver'
import { withState } from '../state'
import { Monster } from './monster'
import { Creature } from './creature'
import { ToolTips } from '../components/toolTips'
import styled from 'styled-components'

type Props = {
  creature: Creature<>,
  isEnemy: boolean,
  state: State,
}

function any(any: any): any {
  return any
}

const CreatureWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 12px;
`

const CreaturePortrait = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  margin: 12px;
  position: relative;
`

const HealthBarWrapper = styled.div`
  display: flex;
  flex-direction: horizontal;
  width: 250px;
  height: 12px;
`

// const HealthBar = ({ health, max, block }) => <HealthBarWrapper>
//     <HealthBarBody style={{ flex: health }}/>
//     <div style={{ flex: max-health }}/>
// </HealthBarWrapper>

export const renderCreature = withState(
  ({ isEnemy, creature, state }: Props) => {
    const { health, inner } = creature
    const { maxHealth } = inner

    // TODO: put the block indicator back in
    // const maybeBlock = creature.effects.filter(e => e.id == blockSymbol)[0]
    const block: number = 0 // maybeBlock ? maybeBlock.stacks : 0

    let behaviors: BehaviorWrapper[] = []
    // TODO: previously used instanceof NPC
    if (creature instanceof Monster) {
      behaviors.push(creature.behavior)
    }

    return (
      <CreatureWrapper>
        <div style={sty.effectBar}>
          {behaviors.map((b) => (
            <Behavior data={b.simulate(any(creature), resolver)} />
          ))}
        </div>
        <CreaturePortrait style={{ backgroundColor: '#338888' }}>
          <ToolTips effects={creature.effects} />
        </CreaturePortrait>
        <div style={sty.healthBar}>
          <div style={sty.healthBarFill(health, block, maxHealth)} />
          <div style={sty.healthBarEmpty(health, block, maxHealth)} />
          <div style={sty.healthBarBlock(health, block, maxHealth)} />
        </div>
        <div style={sty.effectBar}>
          {[...creature.effects].map((effect) => <Effect effect={effect} />)}
        </div>
        <div>{creature.inner.type}</div>
        <div>
          {health}/{maxHealth}
        </div>
      </CreatureWrapper>
    )
  }
)

const sty = {
  // creature: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //     alignItems: 'center',
  // },
  // img: {
  //     width: '250px',
  //     height: '250px',
  //     borderRadius: '125px',
  //     margins: '10px',
  // },
  healthBar: {
    display: 'flex',
    flexDirection: 'horizontal',
    width: '250px',
    height: '12px',
  },
  healthBarFill(current, block, max) {
    return {
      flex: current,
      backgroundColor: '#ff1111',
    }
  },
  healthBarEmpty(current, block, max) {
    return {
      flex: max - current,
      backgroundColor: '#441515',
    }
  },
  healthBarBlock(current, block, max) {
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
