import { defineCard, Card, PlayArgs } from './../card'
import { BindEffect } from '../../events/bindEffect'
import { block, Block } from '../../effects/block'
import { Creature } from '../../creatures/creature'
import { targeted, damage } from '../../events/damage';
import { AddToHand } from '../../events/addToHand';
import { Jab } from './jab';
import { defineEffect } from '../../effects/effect';
import { endTurn } from '../../events/event';
import { Listener } from '../../events/listener';
import { Strength } from '../../effects/strength'


type FlexData = { flex: number, energy: number }

export const flex = 'flex'
export const Flex: () => Card<FlexData> = defineCard(flex, playFlex, {
    flex: 3,
    energy: 0,
}, {
    energyTemplate: '#{energy}',
    color: '#cc6633',
    titleTemplate: 'Flex',
    textTemplate: 'Gain #{flex} strength. Lose #{flex} strength at the end of your turn.',
})

function* playFlex(self: Card<FlexData>, { actors, resolver, game }: PlayArgs): Generator<any, FlexData, any> {
    const action: BindEffect = yield resolver.processEvent(
        new BindEffect(
            actors, 
            game.player,
            {
                Effect: FlexEffect,
                stacks: self.data.flex,
            },
        ),
    )
    yield resolver.processEvent(
        new BindEffect(
            actors, 
            game.player,
            {
                Effect: Strength,
                stacks: self.data.flex,
            },
        ),
    )
    return { flex: action.data.stacks, energy: self.data.energy }
}

const FlexEffect = defineEffect('flex', {
    description: 'Lose #{stacks} #[Strength] at the end of the turn.',
    innerColor: "#aacc44",
    outerColor: "#889911",
    name: "Flex",
    sides: 3,
}, {
    stacked: true,
    delta: n => 0,
    min: 1, 
    max: 99,
    on: endTurn,
}, (owner, self) => new Listener('flex', { 
    subject: owner,
    type: endTurn,
}, function*({ resolver }){
    let actors = new Set()
    actors.add(owner)
    actors.add(self)
    yield resolver.processEvent(new BindEffect(actors, owner, {
        stacks: -self.stacks,
        Effect: Strength,
    }, block, 'flex'))
}, false), [], [endTurn])