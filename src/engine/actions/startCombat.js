import type { CustomAction } from "./action"
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
import { ConsumerArgs } from "./listener";

type Data = {
    effect: Symbol,
    stacks: number,
}

export { startCombat }
export const StartCombat: CustomAction<> = MetaAction(startCombat, function({ game, resolver }: ConsumerArgs<>): void { 
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
        new Acid(),
        new Footwork(),
        // new RaiseDead(),
    ].forEach(card => game.drawPile.push(card))

    game.resolver.enqueueActions(new EndTurn({}, game.enemies[0], {}))

})