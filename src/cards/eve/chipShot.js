import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted, blockable } from './../../events/damage'
import { Listener } from '../../events/listener'
import { BindEffect } from '../../events/bindEffect'
import { Frailty } from '../../effects/frailty'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from '../utils'

type ChipShotData = BasicCardData & { damage: number, frailty: number }

export const chipShot = 'chipShot'
export const ChipShot: () => Card<ChipShotData> = defineCard(
  chipShot,
  playChipShot,
  {
    damage: 8,
    energy: 1,
    frailty: 2,
  },
  {
    color: '#bb4433',
    title: 'Chip Shot',
    text: `Deal #{damage} damage. On damage, apply #{frailty} #[Frailty].`,
  }
)

function* playChipShot(
  self: Card<ChipShotData>,
  { game, resolver, actors, energy }: PlayArgs
): Generator<any, ChipShotData, any> {
  let target = yield queryEnemy(game)
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
  const binding: BindEffect = yield resolver.processEvent(
    new BindEffect(
      self,
      target,
      {
        Effect: Frailty,
        stacks: self.data.frailty,
      },
      targeted
    )
  )
  return { damage: action.data.damage, energy, frailty: binding.data.stacks }
}
