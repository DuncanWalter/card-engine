import { construct } from './../../utility/construct' 
import { Action } from './action'

import type { ActionT } from './action'

export type DamageActionT = ActionT & { damage: number }

export function DamageAction(actor: mixed, subject: { health: number }, damage: number, ...tags: Array<string>): DamageAction {
    let da = Action(({ action, subject }) => { 
        // $FlowFixMe: ActionResolver Makes this safe
        subject.health -= action.damage;
    }, actor, subject, 'damage', ...tags);
    // $FlowFixMe: There should be a way to make this work...
    da.damage = damage;
    return da;
}