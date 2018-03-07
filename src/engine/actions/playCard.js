import type { Card } from '../cards/card'
import type { CustomAction } from "./action"
import { Creature } from '../creatures/creature'
import { Action, MetaAction } from './action'
import { Player } from '../creatures/player'

type Data = {
    target: void | Creature | Card<any>,
    success: boolean,
    destination?: Card<any>[],
}

export const playCard: Symbol = Symbol('playCard')
export const PlayCard: CustomAction<Data, Card<any>, Player> = MetaAction(playCard, ({ game, data, subject, actor, resolver, cancel }: *) => { 
    // TODO: perform an actual energy check
    if (actor.energy < subject.data.energy) return cancel()
    actor.energy -= subject.data.energy //TODO: subject.energy;

    // TODO: should I check if the card was ever in hand?
    // I think yes, but continue even if not. Just don't splice then
    game.hand.splice(game.hand.indexOf(subject), 1)
    game.activeCards.push(subject) // TODO: could be safer than push pop

    subject.play({ 
        resolver,
        actor,
        subject,
        target: data.target,
        data: subject.data,
    })

    game.activeCards.pop()

    if(data.destination != undefined){
        data.destination.push(subject)
    } else {
        game.discardPile.push(subject)
    }
    
    data.success = true
})





