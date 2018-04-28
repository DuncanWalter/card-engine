import type { CustomAction } from '../actions/action'
import type { Creature } from '../creatures/creature'
import type { Card } from '../cards/card'
import { MetaAction, Action } from './action'
import { ConsumerArgs } from './listener';
import { CardStack } from '../cards/cardStack';

type Data = {
    from?: CardStack,
}

export const discard: Symbol = Symbol('discard')
export const Discard: CustomAction<Data, Card<>> = MetaAction(discard, ({ data, game, subject, cancel }: ConsumerArgs<Data, Card<>>): void => { 
    
    if(data.from){
        data.from.remove(subject)
    }
    
    game.discardPile.add(subject)
    
})




