import { Module } from './utils/module'
import { resolver } from './events/eventResolver'
import { StartGame } from './events/startGame'

import { stream, state, dispatch } from './state'
import { registerEncounter } from './paths/encounterLibrary'
import { Turtle } from './creatures/turtle/turtle'
import { Cobra } from './creatures/cobra/cobra'
import { Toad } from './creatures/toad/toad'
import { registerReward } from './paths/reward'
import { Heal } from './events/heal'
import { history } from './utils/navigation'
import { CardLibrary } from './cards/cardLibrary'
import { BindMaxHp } from './events/bindMaxHp'

import './cards/adventurer/adventurer'

import './cards/eve/eve'
import './cards/prometheus/prometheus'
import './cards/jekyll/jekyll'
import './cards/alonzo/alonzo'
import './cards/argus/argus'
import './cards/anansi/anansi'
import './cards/kubera/kubera'

import { Game, withGame } from './game/battle/battleState';
import { AcquirePragma } from './events/acquirePragma';
import { registerOverlay } from './game/overlay';
import { Col, Row, Shim, Button } from './utility';
import { RemoveCard } from './events/removeCard';
import { Player } from './creatures/player';
import { CardPanel } from './game/cardPanel';
import { CardFan } from './game/cardFan';
import { ImproveCard } from './events/improveCard';

// how many creatures?

// slime
// slime II
// slime II Big
// slime Big
// slaver
// slaver II
// louse
// fungus
// cultist
// wurm

// gremlins (defender, sneaky, angry, wizard, toxic)

// 15 minor
// 3 boss
// 3 major
// X3 to account for floors

// card type tagging
// exclusive tags
// inclusive tags

export const engine = new Module('engine', ({ global, next }) => {

    registerEncounter(10, Turtle)
    registerEncounter(11, Toad, Toad)
    registerEncounter(13, Cobra)
    registerEncounter(14, Turtle, Turtle)
    registerEncounter(15, Toad, Toad, Toad)
    registerEncounter(16, Cobra, Turtle)
    registerEncounter(19, Cobra, Toad, Toad)
    registerEncounter(21, Cobra, Cobra, Toad)
    registerEncounter(22, Cobra, Cobra, Turtle)

    registerReward('Heal', 'Heal 5 health points.', 1, function* heal(self, resolver, game){
        self.collected = true
        yield resolver.processEvent(new Heal(game.player, game.player, {
            healing: 5,
        }))
    })

    registerReward('Pragma', 'Acquire a Pragma.', 5, function* acquire(self, resolver, game){
        self.collected = true
        yield resolver.processEvent(new AcquirePragma(
            game.player, 
            game.pragmaSequence.next(game.pragmaSeed), 
            {},
        ))
    })

    next()

    resolver.initialize(() => withGame(({ game }) => game)({}))
    
}, [], [])








