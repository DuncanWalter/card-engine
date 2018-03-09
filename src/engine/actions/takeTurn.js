import type { Card } from '../cards/card'
import type { CustomAction } from "./action"
import { Creature } from '../creatures/creature'
import { Action, MetaAction } from './action'
import { Player } from '../creatures/player'
import { NPC } from '../creatures/npc';

type Data = { }

export const takeTurn: Symbol = Symbol('takeTurn')
export const TakeTurn: CustomAction<Data, Creature, any> = MetaAction(takeTurn, function*({ game, subject, resolver }): * { 
    if(subject instanceof NPC){
        yield subject.takeTurn(resolver, game)
    }
})
