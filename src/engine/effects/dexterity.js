import { MetaEffect, Effect } from "./effect"
import { damage } from "../actions/damage"
import { block, Block } from "./block"
import { bindEffect } from "../actions/bindEffect"
import { Card } from "../cards/card"
import type { Listeners } from "../actions/actionResolver"

export const dexterity = Symbol('dexterity');
export const Dexterity: Class<Effect> = MetaEffect(dexterity, true, x => x, (owner, self) => ({
    id: dexterity,
    header: {
        subjects: [owner],
        filter: action => action.data.Effect == Block,
        type: bindEffect,
    },
    consumer({ data, actor }){
        if(actor instanceof Card){
            if(typeof data.stacks == 'number'){
                if(data.stacks >= 0){
                    data.stacks += self.stacks
                }
            }
        }
    },  
}), [], [bindEffect])