import { Module } from './utils/module'
import { resolver } from './events/eventResolver'
import { StartGame } from './events/startGame'

import { stream, state, dispatch } from './state'
import { registerEncounter } from './paths/encounterLibrary'
import { Turtle } from './creatures/turtle/turtle'
import { Cobra } from './creatures/cobra/cobra'
import { Toad } from './creatures/toad/toad'
import { registerReward } from './paths/rewardLibrary'
import { Heal } from './events/heal'
import { navigateTo } from './utils/navigation'
import { CardLibrary } from './cards/cardLibrary'
import { activateReward, collectReward } from './paths/pathState'
import { BindMaxHp } from './events/bindMaxHp'

import './cards/adventurer/adventurer'
import './cards/eve/eve'
import './cards/prometheus/prometheus'
import './cards/jekyll/jekyll'
import { Game, emit, liftState } from './game/battle/battleState';
import { AcquirePragma } from './events/acquirePragma';

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

    registerReward('Heal 5 health points.', 1, function* heal(self, state){
        collectReward(dispatch, self)
        yield resolver.processEvent(new Heal(resolver.state.getGame().player, resolver.state.getGame().player, {
            healing: 5,
        }))
    })

    registerReward('Gain 1 max hp.', 1, function* heal(self, state): * {
        collectReward(dispatch, self)
        yield resolver.processEvent(new BindMaxHp(resolver.state.getGame().player, resolver.state.getGame().player, {
            points: 1,
        }))
    })

    // TODO: make rewards respond to player classes
    registerReward('Draft a Card.', 2, function* draft(self, state): * {
        activateReward(dispatch, self)
        navigateTo('/game/cardDraft')
    }, (self, level, seed) => {
        let cards = CardLibrary.sample(Math.floor(3 + level / 6.5), {
            Eve: 1.0,
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

    registerReward('Remove a Card.', 3, function* remove(self, state){
        activateReward(dispatch, self)
        navigateTo('/game/cardRemove')
    })

    registerReward('Acquire a Pragma.', 1, function* acquire(self, state){
        collectReward(dispatch, self)
        const game = resolver.state.getGame()
        yield resolver.processEvent(new AcquirePragma(
            game.player, 
            game.pragmaSequence.next(), 
            {},
        ))
    })

    // registerReward('Gain 1 fame point.', 2, function* remove(self, state): * {
    //     collectReward(dispatch, self)
    //     yield resolver.processEvent(new BindFamePoints({}, state.battle.player, {
    //         points: 1,
    //     }))
    // })

    next()

    let cachedGameState = state.battle
    let cachedGame: Game = liftState(cachedGameState)


    resolver.initialize({
        getGame(): Game {
            if(state.battle != cachedGameState){
                cachedGameState = state.battle
                // TODO: is it better to not lift state?
                cachedGame = liftState(cachedGameState)
            }
            return cachedGame
        },
        setGame(game: Game){
            dispatch(emit(game))
        },
    })
    
}, [], [])








