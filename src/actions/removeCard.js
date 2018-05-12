import type { CustomAction } from '../actions/action'
import type { CreatureWrapper } from '../creatures/creature'
import type { Card } from '../cards/card'
import { MetaAction, Action } from './action'
import { ConsumerArgs } from './listener';
import { CardStack } from '../cards/cardStack';

type Data = {
    target: Card<any>,   
}

export const removeCard: Symbol = Symbol('removeCard')
export const RemoveCard: CustomAction<any, Card<>> = MetaAction(removeCard, ({ game, subject }: ConsumerArgs<Data, CreatureWrapper<>>): void => { 
    game.deck.remove(subject)
})




