import type { Card } from '../cards/card'
import type { Event } from './event'
import type { CardStack } from '../cards/cardStack'
import { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { Player } from '../creatures/player'
import { ConsumerArgs } from './listener'
import { BindEnergy } from './bindEnergy'
import { AddToDiscardPile } from './addToDiscardPile'

type Type = {
    data: {
        from?: CardStack,
    },
    subject: Card<>,
}

export const playCard: Symbol = Symbol('playCard')
export const PlayCard = defineEvent(playCard, function*({ game, data, subject, actors, resolver, cancel }: ConsumerArgs<Type>){ 

    if(game.player.energy < subject.data.energy){
        return cancel()
    } else if(data.from){
        data.from.remove(subject)
    }

    yield resolver.processEvent(new BindEnergy(actors, game.player, {
        quantity: -subject.data.energy
    }, playCard))
    
    game.activeCards.addToTop(subject) // TODO: could be safer than push pop

    actors.add(subject)

    yield subject.play({ 
        resolver,
        actors,
        subject,
        data: subject.data,
        game,
    })

    let card: Card<> = subject
    let event = yield resolver.processEvent(new AddToDiscardPile(actors, card, playCard))
    
    game.activeCards.take()

    console.log("Play Card:", event)

})





