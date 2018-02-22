import { construct } from './../../utility/construct' 
import { Action } from './action'

import type { ActionT } from './action'

export type DefendActionT = ActionT & { block: number }

export const DefendAction = (actor: mixed, subject: {block: number}, block: number, ...tags: Array<string>) => {
    let ba = Action(({ action, subject }) => { 
        // $FlowFixMe: ActionResolver Makes this safe
        subject.block += action.block;
    }, actor, subject, 'block', ...tags);
    // $FlowFixMe: There should be a way to make this work...
    ba.block = block;
    return ba;
}