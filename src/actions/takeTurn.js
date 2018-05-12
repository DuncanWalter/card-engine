import type { Card } from '../cards/card'
import type { CustomAction } from "./action"
import { CreatureWrapper } from '../creatures/creature'
import { Action, MetaAction } from './action'
import { MonsterWrapper } from '../creatures/monster';


export const takeTurn: Symbol = Symbol('takeTurn')
export const TakeTurn: CustomAction<any, CreatureWrapper<>, any> = MetaAction(takeTurn, function*({ game, subject, resolver }): * { 
    if(subject instanceof MonsterWrapper){
        let a = game.enemies.includes(subject)
        let b = game.allies.includes(subject)
        if(a || b){
            yield subject.takeTurn(resolver, game)
        }
    }
})
