import type { Card } from '../cards/card'
import type { CustomAction } from './action'
import type { CardStack } from '../cards/cardStack';
import { Creature } from '../creatures/creature'
import { Action, MetaAction } from './action'
import { Player } from '../creatures/player'
import { ConsumerArgs } from './listener';
import { BindEnergy } from './bindEnergy';
import { AddToDiscardPile } from './addToDiscard';

type Data = {
    from?: CardStack,
}

export const playCard: Symbol = Symbol('playCard')
export const PlayCard: CustomAction<Data, Card<>, Player> = MetaAction(playCard, function*({ game, data, subject, actors, resolver, cancel }: ConsumerArgs<Data>): * { 

    if(game.player.energy < subject.data.energy){
        return cancel()
    } else if(data.from){
        data.from.remove(subject)
    }

    yield resolver.processAction(new BindEnergy({}, {}, {
        quantity: -subject.data.energy
    }, playCard))
    
    game.activeCards.addToTop(subject) // TODO: could be safer than push pop

    actors.add(subject)

    yield subject.play({ 
        // target: data.target,
        resolver,
        actors,
        subject,
        data: subject.data,
        game,
    })

    

    let action = yield resolver.processAction(new AddToDiscardPile(actors, subject, {}, playCard))
    
    game.activeCards.take()

    console.log("Play Card:", action)

})





