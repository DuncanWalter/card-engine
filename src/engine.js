import { Module } from './utils/module'
import { resolver } from './actions/actionResolver'
import { StartGame } from './actions/startGame'

import './cards/adventurer/adventurer'
import './cards/brawler/brawler'
import { stream, state, dispatch } from './state'
import { registerEncounter } from './paths/encounterLibrary'
import { Turtle } from './creatures/turtle/turtle'
import { Cobra } from './creatures/cobra/cobra'
import { Toad } from './creatures/toad/toad'
import { registerReward } from './paths/rewardLibrary'
import { Heal } from './actions/heal'
import { navigateTo } from './utils/navigation'
import { CardLibrary } from './cards/cardLibrary'
import { activateReward, collectReward } from './paths/pathState'
import { BindMaxHp } from './actions/bindMaxHp';
import { SSL_OP_LEGACY_SERVER_CONNECT } from 'constants';
import { BindFamePoints } from './actions/bindFamePoints';

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
    registerEncounter(15, Toad, Toad, Toad)
    registerEncounter(16, Cobra, Turtle)
    registerEncounter(19, Cobra, Toad, Toad)

    registerReward('Heal 5 health points.', 1, function* heal(self, state): * {
        collectReward(dispatch, self)
        yield resolver.processAction(new Heal({}, state.battle.player, {
            healing: 5,
        }))
    })
    registerReward('Gain 1 max hp.', 1, function* heal(self, state): * {
        collectReward(dispatch, self)
        yield resolver.processAction(new BindMaxHp({}, state.battle.player, {
            points: 1,
        }))
    })

    registerReward('Draft a Card.', 2, function* draft(self, state): * {
        activateReward(dispatch, self)
        navigateTo('/game/cardDraft')
    }, (self, level, seed) => {
        let cards = CardLibrary.sample(Math.floor(3 + level / 6.5), {
            Brawler: 1.0,
        }, {
            F: 0.5,
            D: 0.9,
            C: 0.6,
            B: 0.2,
            A: 0.1,
        }, seed).map(CC => new CC())
        // $FlowFixMe
        self.cards = cards
        return self
    })

    registerReward('Remove a Card.', 3, function* remove(self, state): * {
        activateReward(dispatch, self)
        navigateTo('/game/cardRemove')
    })

    // registerReward('Gain 1 fame point.', 2, function* remove(self, state): * {
    //     collectReward(dispatch, self)
    //     yield resolver.processAction(new BindFamePoints({}, state.battle.player, {
    //         points: 1,
    //     }))
    // })
    

    next()

    // $FlowFixMe
    resolver.initialize(() => [
        state.battle.allies,
        state.battle.player,
        state.battle.enemies,
        state.battle.drawPile,
        state.battle.discardPile,
        state.battle.hand,
        state.battle.activeCards,
    ], { state, emit: () => dispatch({ type: 'emitBattleState' }) })
    
}, [], [])








