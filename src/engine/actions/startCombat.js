import { MetaAction } from "./action"
import { Creature } from "../creatures/creature"
import { EndTurn } from "./endTurn"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { Defend } from "../cards/defend"
import { Strike } from "../cards/strike"
import { Bash } from "../cards/bash"

import type { CA } from "./action"

type Data = {
    effect: Symbol,
    stacks: number,
}

export const startCombat = Symbol('startCombat')
export const StartCombat: CA<> = MetaAction(startCombat, ({ game, subject, resolver }: *) => { 
    [
        new Strike(),
        new Strike(),
        new Strike(),
        new Strike(),
        new Strike(),
        new Bash(),
        new Defend(),
        new Defend(),
        new Defend(),
        new Defend(),
        new Defend(),
    ].forEach(card => game.drawPile.push(card))

    game.resolver.enqueueActions(new EndTurn({}, game.enemies[0], {}))
})