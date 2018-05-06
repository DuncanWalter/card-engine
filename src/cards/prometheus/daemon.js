import { MetaCard, Card, PlayArgs } from './../card'
import { Damage, targeted } from './../../actions/damage'
import { blockable } from '../../actions/damage'
import { Creature } from '../../creatures/creature'
import { queryEnemy } from './../utils'
import { BindEffect } from '../../actions/bindEffect';
import { Vulnerability } from '../../effects/vulnerability';
import { Taunt } from '../../effects/taunt';
import { SpawnCreature } from '../../actions/spawnCreature';
import { Toad } from '../../creatures/toad/toad';

type DaemonData = { energy: number }

export const daemon = 'daemon'
export const Daemon: Class<Card<DaemonData>> = MetaCard(daemon, playDaemon, {
    energy: 0,
}, {
    energyTemplate: '#{energy}',
    color: '#aa11aa',
    titleTemplate: 'Daemon',
    textTemplate: 'Spawn a Daemon.',
})

function* playDaemon({ resolver, actors }: PlayArgs<>): Generator<any, DaemonData, any>{
    // TODO: query creature
    let target = yield queryEnemy(any => true)
    yield resolver.processAction(new SpawnCreature(actors, new Toad(15), {
        isAlly: true,
    }))
    return {
        energy: this.data.energy,
    }
}