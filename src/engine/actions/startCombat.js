import { MetaAction, startCombat } from "./action"
import { Creature } from "../creatures/creature"
import { EndTurn } from "./turnActions"
import { Player } from "../creatures/player"
import { NPC } from "../creatures/npc"
import { Defend } from "../cards/defend"
import { Strike } from "../cards/strike"
import { Bash } from "../cards/bash"

import { Footwork } from "../cards/footwork"
import { Acid } from "../cards/acid"
import type { CA } from "./action"

type Data = {
    effect: Symbol,
    stacks: number,
}

export { startCombat }
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
        new Acid(),
        new Footwork(),
        new Defend(),
    ].forEach(card => game.drawPile.push(card))

    game.resolver.enqueueActions(new EndTurn({}, game.enemies[0], {}))
})