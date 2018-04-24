import type { Card } from '../cards/card'
import type { CustomAction } from './action'
import { Creature } from '../creatures/creature'
import { Action, MetaAction } from './action'
import { Player } from '../creatures/player'
import { ConsumerArgs } from './listener';
import { CardStack } from '../cards/cardStack';
import { BindEnergy } from './bindEnergy';

type Data = {
    target: void | Creature | Card<any>,
    success: boolean,
    destination?: CardStack,
}



export const playCard: Symbol = Symbol('playCard')
export const PlayCard: CustomAction<Data, Card<any>, Player> = MetaAction(playCard, function*({ game, data, subject, actors, resolver, cancel }: ConsumerArgs<Data>): * { 

    if (game.player.energy < subject.data.energy) return cancel()
    yield resolver.processAction(new BindEnergy({}, {}, {
        quantity: -subject.data.energy
    }))

    if (game.hand.has(subject)) game.hand.remove(subject)
    game.activeCards.addToTop(subject) // TODO: could be safer than push pop

    actors.add(subject)

    yield subject.play({ 
        resolver,
        actors,
        subject,
        target: data.target,
        data: subject.data,
        game,
    })

    game.activeCards.take()

    // TODO: rework destinations to allow for exhausts etc
    if(data.destination != undefined){
        data.destination.addToTop(subject)
    } else {
        game.discardPile.addToTop(subject)
    }
    
    data.success = true
})





