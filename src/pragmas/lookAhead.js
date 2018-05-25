import { definePragma } from "./pragma";
import { C } from "../character";
import { Listener, ConsumerArgs } from "../events/listener";
import { startTurn, startCombat } from "../events/event";
import { BindEnergy } from "../events/bindEnergy";
import { DrawCards } from "../events/drawCards";
import { resolver } from "../events/eventResolver";

resolver.registerListenerType('LookAhead', [startTurn], [])
const factory = owner => new Listener('LookAhead', {
    type: startTurn,
    subjects: [resolver.state.getGame().player],
    tags: [startCombat],
}, function*({ game, resolver }: ConsumerArgs<>){
    yield resolver.processEvent(new BindEnergy(owner, game.player, {
        quantity: 1,
    }))
    yield resolver.processEvent(new DrawCards(owner, game.player, {
        count: 1,
    }))
}, false)

export const LookAhead = definePragma('LookAhead', C, function*(){}, factory)
