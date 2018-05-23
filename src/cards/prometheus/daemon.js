import { defineCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../events/damage'
import { blockable } from '../../events/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { BindEffect } from '../../events/bindEffect';
import { Vulnerability } from '../../effects/vulnerability';
import { Taunt } from '../../effects/taunt';
import { SpawnCreature } from '../../events/spawnCreature';
import { Toad } from '../../creatures/toad/toad';
import { Daemon as DaemonMonster } from '../../creatures/daemon/daemon'
import { randomSequence } from '../../utils/random';

type DaemonData = { energy: number }

export const daemon = 'daemon'
export const Daemon: () => Card<DaemonData> = defineCard(daemon, playDaemon, {
    energy: 0,
}, {
    energyTemplate: '#{energy}',
    color: '#aa11aa',
    titleTemplate: 'Daemon',
    textTemplate: 'Spawn a Daemon.',
})

function* playDaemon(self: Card<DaemonData>, { resolver, actors }: PlayArgs): Generator<any, DaemonData, any>{
    // TODO: query creature
    let target = yield queryEnemy(any => true)
    yield resolver.processEvent(new SpawnCreature(actors, new DaemonMonster(randomSequence(1)), {
        isAlly: true,
    }))
    return {
        energy: self.data.energy,
    }
}