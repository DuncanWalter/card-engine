import type { Event } from './event'
import { defineEvent } from './event'
import { Player } from '../creatures/player'
import { CardLibrary } from '../cards/cardLibrary'
import { ConsumerArgs } from './listener'
import { TrainingDummy } from '../creatures/trainingDummy'
import { dispatch } from '../state'
import { Path } from '../paths/path'
import { Sequence, randomSequence } from '../utils/random'
import { Strike } from '../cards/adventurer/strike'
import { Defend } from '../cards/adventurer/defend'
import { Monster } from '../creatures/monster'
import { Card } from '../cards/card'
import { LookAhead } from '../pragmas/lookAhead'
import { PragmaGroup } from '../pragmas/pragmaGroup'
import { characters } from '../character'
import { toExtractor } from '../utils/entity'

export const StartGame = defineEvent('startGame', function*({
  resolver,
  game,
  data,
}: ConsumerArgs<>) {
  let seed = randomSequence(data.seed * Math.random())

  game.dummy = new TrainingDummy(game, randomSequence(1))
  game.player = new Player(
    {
      type: 'Player',
      health: 65,
      maxHealth: 65,
      effects: [],
      seed: data.seed,
      energy: 3,
      isActive: true,
      sets: [...data.character],
    },
    toExtractor({})
  )
  game.deck.clear()
  game.drawPile.clear()
  game.hand.clear()
  game.discardPile.clear()
  game.exhaustPile.clear()
  game.enemies.clear()
  game.allies.clear()
  game.pragmas = new PragmaGroup([])
  // TODO: seed this properly
  game.pragmaSequence = new PragmaGroup(
    [
      ...['Adventurer', ...data.character].reduce((a, c) => {
        const character = characters.get(c)
        if (character) {
          character.pragmaPool.forEach((P) => a.add(P))
        }
        return a
      }, new Set()),
    ].map((P) => new P())
  )

  let cards = CardLibrary.sample(
    5,
    data.character.reduce(
      (acc, set) => {
        acc[set] = 0.6
        return acc
      },
      { Adventurer: 1.5 }
    ),
    {
      F: 0.9,
      D: 0.5,
      C: 0.3,
      B: 0.1,
    },
    seed
  )

  game.deck.add(...cards.map((CC) => new CC()))

  cards = CardLibrary.sample(
    5,
    data.character.reduce(
      (acc, set) => {
        acc[set] = 1.0
        return acc
      },
      { Adventurer: 0.5 }
    ),
    {
      F: 0.9,
      D: 0.5,
      C: 0.3,
      B: 0.1,
    },
    seed
  )

  game.deck.add(...cards.map((CC) => new CC()))

  game.root = game.path = Path.generate(0, game, seed)
})
