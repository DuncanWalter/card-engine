import { construct } from '../../utility/construct' 
import { gameState } from '../gameState'

import type { Card } from '../cards/card'
import { Creature } from '../creatures/creature'
import { Action, MetaAction } from './action'
import { Player } from '../creatures/player';
import type { CA } from './action'

type Data = {
    target: any,
    success: boolean,
}

export const playCard = Symbol('playCard')
export const PlayCard: CA<Data, Card<any>, Player> = MetaAction(playCard, ({ data, subject, actor, resolver, cancel }: *) => { 
    // TODO: perform an energy check
    // if(!actor.energy){ cancel() }
    // actor.energy -= 1 //TODO: (subject: CardT).energy;
    subject.play({ 
        resolver,
        actor: subject, 
        subject: data.target,
    })

    const game = gameState

    game.discardPile.push(game.hand.splice(game.hand.indexOf(subject), 1)[0])
    data.success = true
})





