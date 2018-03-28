import type { CustomAction } from '../actions/action'
import type { Creature } from '../creatures/creature'
import type { Card } from '../cards/card'
import { MetaAction, Action } from './action'
import { ConsumerArgs } from './listener';
import { CardStack } from '../cards/cardStack';

type Data = {
    target: Card<any>,   
}

export const discard: Symbol = Symbol('discard')
export const Discard: CustomAction<Data, Creature> = MetaAction(discard, ({ game, data, subject, cancel }: ConsumerArgs<Data, Creature>): void => { 
    if(game.hand.has(data.target)){
        game.hand.remove(data.target)
    }
    


    
})




