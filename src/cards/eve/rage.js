import { defineCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted, Damage } from '../../events/damage';
import { AddToHand } from '../../events/addToHand';
import { Jab } from './jab';
import { defineEffect } from '../../effects/effect';
import { EndTurn } from '../../events/turnActions';
import { Listener } from '../../events/listener';


type RageData = { rage: number, energy: number }

export const rage = 'rage'
export const Rage: () => Card<RageData> = defineCard(rage, playRage, {
    rage: 3,
    energy: 0,
}, {
    energyTemplate: '#{energy}',
    color: '#88aa33',
    titleTemplate: 'Rage',
    textTemplate: 'Gain #{block} block whenever you deal damage until the end of your turn.',
})

function* playRage(self: Card<RageData>, { actors, resolver, game }: PlayArgs): Generator<any, RageData, any> {
    const action: BindEffect = yield resolver.processEvent(
        new BindEffect(
            actors, 
            game.player,
            {
                Effect: RageEffect,
                stacks: self.data.rage,
            },
        ),
    )
    return { rage: action.data.stacks, energy: self.data.energy }
}

const RageEffect = defineEffect('rage', {
    description: 'Upon dealing damage, gain #{stacks} block.',
    innerColor: "#aacc44",
    outerColor: "#889911",
    name: "Rage",
    sides: 6,
}, {
    stacked: true,
    delta: n => 0,
    min: 1, 
    max: 99,
    on: EndTurn,
}, owner => ({ 
    actors: [owner],
    type: Damage,
}), (owner, type) => function*({ resolver }): * {
    let actors = new Set()
    actors.add(owner)
    actors.add(self)
    yield resolver.processEvent(new BindEffect(actors, owner, {
        stacks: owner.stacksOf(type),
        Effect: Block,
    }, Block, 'rage'))
}, [], [Damage])