import type { Card } from '../cards/card'
import { Creature } from '../creatures/creature'
import { Action, MetaAction } from './action'
import { Player } from '../creatures/player'
import type { CA } from './action'

type Data = {
    target: any,
    success: boolean,
}

export const playCard = Symbol('playCard')
export const PlayCard: CA<Data, Card<any>, Player> = MetaAction(playCard, ({ game, data, subject, actor, resolver, cancel }: *) => { 
    // TODO: perform an actual energy check
    if (actor.energy < subject.energy) return cancel()
    
    actor.energy -= subject.energy //TODO: subject.energy;
    subject.play({ 
        resolver,
        actor: subject, 
        subject: data.target,
    })

    game.discardPile.push(game.hand.splice(game.hand.indexOf(subject), 1)[0])
    data.success = true
})





