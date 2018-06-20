import { defineCard, Card, PlayArgs, BasicCardData } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { BindEffect } from '../../events/bindEffect'
import { Vulnerability } from '../../effects/vulnerability'
import { SpawnCreature } from '../../events/spawnCreature'
import { Toad } from '../../creatures/toad/toad'
import { Daemon as DaemonMonster } from '../../creatures/daemon/daemon'
import { randomSequence } from '../../utils/random'

type DaemonData = BasicCardData

export const daemon = 'daemon'
export const Daemon: () => Card<DaemonData> = defineCard(
  daemon,
  playDaemon,
  {
    energy: 0,
  },
  {
    color: '#aa11aa',
    title: 'Daemon',
    text: 'Spawn a Daemon.',
  }
)

function* playDaemon(
  self: Card<DaemonData>,
  { game, resolver, actors, energy }: PlayArgs
): Generator<any, DaemonData, any> {
  // TODO: query creature
  let target = yield queryEnemy(game)
  yield resolver.processEvent(
    new SpawnCreature(actors, new DaemonMonster(game, randomSequence(1)), {
      isAlly: true,
    })
  )
  return { energy }
}
