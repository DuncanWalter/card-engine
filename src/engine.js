import { Module } from './utils/module'
import { resolver } from './actions/actionResolver'
import { StartGame } from './actions/startGame'

import './cards/adventurer/adventurer'
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
        yield resolver.processAction(new Heal({}, state.battle.player, {
            healing: 5,
        }))
    })

    registerReward('Draft a Card.', 2, function* draft(self, state): * {
        activateReward(dispatch, self)
        navigateTo('/game/cardDraft')
    }, (self, level, seed) => {
        self.cards = CardLibrary.sample(Math.floor(3 + level / 6.5), seed).map(C => new C())
        return self
    })

    registerReward('Heal 9 health points.', 3, function* heal(self, state): * {
        collectReward(dispatch, self)
        yield resolver.processAction(new Heal({}, state.battle.player, {
            healing: 15,
        }))
    })

    registerReward('Remove a Card.', 3, function* remove(self, state): * {
        activateReward(dispatch, self)
        navigateTo('/game/cardRemove')
    })
    
    registerReward('Heal 25 health points.', 5, function* heal(self, state): * {
        collectReward(dispatch, self)
        yield resolver.processAction(new Heal({}, state.battle.player, {
            healing: 25,
        }))
    })











    
    console.log('engine loaded')

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
    
    // global.cardLibrary.initialize()
    // global.reactionLibrary.initialize()
}, [], [])








