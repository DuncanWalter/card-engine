import type { Card } from '../cards/card'
import type { CustomAction } from "./action"
import { Creature } from '../creatures/creature'
import { Action, MetaAction } from './action'
import { Monster } from '../creatures/monster';


export const takeTurn: Symbol = Symbol('takeTurn')
export const TakeTurn: CustomAction<any, Creature<>, any> = MetaAction(takeTurn, function*({ game, subject, resolver }): * { 
    if(subject instanceof Monster){
        let a = game.enemies.includes(subject)
        let b = game.allies.includes(subject)
        if(a || b){
            yield subject.takeTurn(resolver, game)
        }
    }
})
