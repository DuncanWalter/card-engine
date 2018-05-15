import { defineCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted, damage } from '../../events/damage';
import { AddToHand } from '../../events/addToHand';
import { Jab } from './jab';
import { MetaEffect } from '../../effects/effect';
import { endTurn } from '../../events/event';
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

function* playRage(self: Card<RageData>, { actors, resolver, game }: PlayArgs<>): Generator<any, RageData, any> {
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






const rageSymbol = Symbol('rage')
const RageEffect = MetaEffect(rageSymbol, {
    description: '',
    innerColor: "#aacc44",
    outerColor: "#889911",
    name: "Rage",
    sides: 6,
}, {
    stacked: true,
    delta: n => 0,
    min: 1, 
    max: 99,
    on: endTurn,
}, (owner, self) => new Listener(rageSymbol, { 
    actors: [owner],
    type: damage,
}, function*({ resolver }): * {
    let actors = new Set()
    actors.add(owner)
    actors.add(self)
    yield resolver.processEvent(new BindEffect(actors, owner, {
        stacks: self.stacks,
        Effect: Block,
    }, block, rageSymbol))
}, false), [], [damage])