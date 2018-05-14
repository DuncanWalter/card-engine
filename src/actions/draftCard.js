import type { CustomAction } from '../actions/action'
import type { Creature } from '../creatures/creature'
import type { Card } from '../cards/card'
import { MetaAction, Action } from './action'
import { ConsumerArgs } from './listener';
import { CardStack } from '../cards/cardStack';

type Data = {
    target: Card<any>,   
}

export const draftCard: Symbol = Symbol('draftCard')
export const DraftCard: CustomAction<any, Card<>> = MetaAction(draftCard, ({ game, subject }: ConsumerArgs<Data, Creature<>>): void => { 

    game.deck.add(subject)
    
})




