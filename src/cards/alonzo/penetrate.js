import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted, blockable } from './../../events/damage'
import { Listener } from '../../events/listener'
import { BindEffect } from '../../events/bindEffect'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from '../utils'
import { Strength } from '../../effects/strength'

type PenetrateData = BasicCardData & { damage: number, strength: number }

export const Penetrate: () => Card<PenetrateData> = defineCard(
  'penetrate',
  playPenetrate,
  {
    damage: 7,
    energy: 1,
    strength: 1,
  },
  {
    color: '#6666cc',
    title: 'Penetrate',
    text: `Deal #{damage} damage. On damage, gain #{strength} #[Strength].`,
  }
)

function* playPenetrate(
  self: Card<PenetrateData>,
  { resolver, actors, energy, game }: PlayArgs
): Generator<any, PenetrateData, any> {
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
      game.player,
      {
        Effect: Strength,
        stacks: self.data.strength,
      },
      targeted
    )
  )
  return { damage: action.data.damage, energy, strength: binding.data.stacks }
}
