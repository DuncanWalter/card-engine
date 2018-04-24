import type { CustomAction } from '../actions/action'
import type { Creature } from '../creatures/creature'
import type { Card } from '../cards/card'
import { MetaAction, Action } from './action'
import { ConsumerArgs } from './listener';
import { CardStack } from '../cards/cardStack';

type Data = {}

export const discard: Symbol = Symbol('discard')
export const Discard: CustomAction<Data, Creature> = MetaAction(discard, ({ game, subject, cancel }: ConsumerArgs<Data, Card<>>): void => { 
    if(game.hand.has(subject)){
        game.hand.remove(subject)
    }
    if(game.drawPile.has(subject)){
        game.drawPile.remove(subject)
    }
    if(game.activeCards.has(subject)){
        game.activeCards.remove(subject)
    }
    if(!game.discardPile.has(subject)){
        game.discardPile.add(subject)
    }    
})




