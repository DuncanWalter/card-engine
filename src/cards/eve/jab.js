import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { Discard } from '../../events/discard'
import { Singleton } from '../../effects/singleton'

type JabData = BasicCardData & { damage: number }

export const jab = 'jab'
export const Jab: () => Card<JabData> = defineCard(
  jab,
  playJab,
  {
    energy: 0,
    damage: 5,
  },
  {
    color: '#662222',
    title: 'Jab',
    text: 'Deal #{damage} damage. #[Singleton].',
  },
  [Singleton, 1]
)

function* playJab(
  self: Card<JabData>,
  { game, resolver, actors, energy }: PlayArgs
): Generator<any, JabData, any> {
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
  return { damage: action.data.damage, energy }
}
