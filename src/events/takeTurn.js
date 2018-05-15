import type { Card } from '../cards/card'
import type { Event } from "./event"
import { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { Monster } from '../creatures/monster';


export const takeTurn: Symbol = Symbol('takeTurn')
export const TakeTurn = defineEvent(takeTurn, function*({ game, subject, resolver }): * { 
    if(subject instanceof Monster){
        let a = game.enemies.includes(subject)
        let b = game.allies.includes(subject)
        if(a || b){
            yield subject.takeTurn(resolver, game)
        }
    }
})
