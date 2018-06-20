import type { ListenerGroup, ListenerType } from '../events/listener'
import type { EventResolver } from './../events/eventResolver'
import type { Event } from './../events/event'
import type { Game } from '../game/battle/battleState'
import type { ID } from '../utils/entity'
import { PlayCard } from '../events/playCard'
import { synchronize } from '../utils/async'
import { resolver } from '../events/eventResolver'
import { Effect, toListener, type EffectType } from '../effects/effect'
import { renderEffect as EffectC } from '../effects/renderEffect'
import { createInterpolationContext, interpolate } from '../utils/textTemplate'
import {
  Entity,
  toExtractor,
  type Extractor,
  type Bundler,
} from '../utils/entity'
import { characters, type CharacterName, Character } from '../character'

export type CardFactory = () => Card<>

export interface PlayArgs {
  +actors: Set<Entity<any>> | Entity<any>;
  +resolver: EventResolver;
  +game: $ReadOnly<Game>;
  +energy: number; // energy actually spent to play, regardless of data cost
}

const cards: Map<
  string,
  (self: Card<any>, PlayArgs) => Promise<any>
> = new Map()

function registerCard(
  type: string,
  play: (self: Card<any>, args: PlayArgs) => Promise<any>
): void {
  cards.set(type, play)
}

export interface CardState<+Data: BasicCardData = BasicCardData> {
  type: string;
  appearance: {
    color: string,
    text: string,
    title: string,
  };
  +data: Data;
  effects: Effect<Card<>>[];
}

export interface BasicCardData {
  energy: number | void | 'X';
  upgraded?: void | 'L' | 'R';
}

// TODO: play args should have data and use another type argument
export class Card<+Data: BasicCardData = BasicCardData> extends Entity<
  CardState<Data>,
  CardState<Data>
> {
  get appearance(): * {
    return this.inner.appearance
  }

  get data(): Data {
    return this.inner.data
  }

  get effects(): Effect<Card<>>[] {
    return this.inner.effects
  }

  get type(): string {
    return this.inner.type
  }

  get listener(): ListenerGroup {
    return this.effects.map((effect) => toListener(this, effect))
  }

  get energy(): number | void | 'X' {
    return this.data.energy
  }

  get playable(): boolean {
    return this.data.energy !== undefined
  }

  wrap(state: CardState<>, extract: Extractor) {
    return state
  }

  unwrap(inner: CardState<any>, bundle: Bundler): CardState<Data> {
    return {
      ...inner,
      data: { ...inner.data },
      appearance: { ...inner.appearance },
      effects: inner.effects.map((effect: Effect<any>) => ({ ...effect })),
    }
  }

  play(ctx: PlayArgs): Promise<Data> {
    const cardBehavior = cards.get(this.type)
    if (cardBehavior) {
      return cardBehavior(this, ctx)
    } else {
      throw new Error(`Unrecognized card type ${this.type}`)
    }
  }

  simulate({
    actors,
    resolver,
  }: PlayArgs): {
    text: string,
    color: string,
    title: string,
    energy: string | number | void,
  } {
    let meta: Data = this.data

    if (meta.energy !== 'X') {
      let e = meta.energy
      resolver.simulate((resolver, game) => {
        this.play({
          actors,
          resolver,
          game,
          energy: e === undefined ? game.player.energy : e,
        }).then((v) => (meta = v))
      })
    }

    const ctx = createInterpolationContext(this.data, meta, {})

    return {
      energy: meta.energy,
      title: interpolate(this.appearance.title, ctx),
      text: interpolate(this.appearance.text, ctx),
      color: this.appearance.color,
    }
  }

  upgrades(sets: CharacterName[]): Card<>[] {
    return [
      ...new Set(
        sets
          .map((set) => characters.get(set))
          .filter((i) => i)
          .map((character: any) => character.members.get(this.type))
          .filter((i) => i)
          .map((membership) => membership.upgrades)
          .reduce((acc, ups) => acc.concat(ups), [])
      ),
    ]
      .map((upgrade) => upgrade(this.data.upgraded))
      .filter((i) => i)
  }

  stacksOf(effectType: EffectType | { +type: EffectType }): number {
    let effects: Effect<any>[] = [...this.effects].filter((effect) => {
      if (effectType instanceof Object) {
        return effect.type === effectType.type
      } else {
        return effect.type === effectType
      }
    })
    if (effects.length === 0) {
      return 0
    } else {
      return effects[0].stacks
    }
  }
}

export function defineCard<D: BasicCardData>(
  type: string, // unique string id
  play: (self: Card<D>, ctx: PlayArgs) => Generator<Promise<any>, D, any>,
  data: $ReadOnly<D>,
  appearance: {
    color: string,
    text: string,
    title: string,
  },
  ...effects: [(stacks: number) => Effect<Card<>>, number][]
): () => Card<D> {
  registerCard(type, synchronize(play))
  return function() {
    return new Card(
      {
        appearance,
        effects: effects.map(([E, s]) => new E(s)),
        type,
        data: { ...data },
      },
      toExtractor({})
    )
  }
}
