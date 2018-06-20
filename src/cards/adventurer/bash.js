import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted, blockable } from './../../events/damage'
import { Listener } from '../../events/listener'
import { BindEffect } from '../../events/bindEffect'
import { Vulnerability } from '../../effects/vulnerability'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from '../utils'

type BashData = BasicCardData & { damage: number }

export const bash = 'bash'
export const Bash: () => Card<BashData> = defineCard(
  bash,
  playBash,
  {
    damage: 8,
    energy: 2,
    playable: true,
  },
  {
    color: '#bb4433',
    title: 'Bash',
    text: `Deal #{damage} damage. Upon dealing damage: apply 2 #[vulnerability].`,
  }
)

// TODO: the bash vulnerability should be a default listener on the damage action
function* playBash(
  self: Card<BashData>,
  { game, resolver, actors, energy }: PlayArgs
) {
  let target = yield queryEnemy(game)
  if (target instanceof Creature) {
    const action: Damage = yield resolver.processEvent(
      new Damage(
        actors,
        target,
        {
          damage: self.data.damage,
        },
        targeted,
        blockable
      )
    )
    // TODO: should be an on damage listener?
    yield resolver.processEvent(
      new BindEffect(
        self,
        target,
        {
          Effect: Vulnerability,
          stacks: 2,
        },
        blockable
      )
    )
    return {
      playable: true,
      damage: action.data.damage,
      energy,
    }
  } else {
    return self.data
  }
}
