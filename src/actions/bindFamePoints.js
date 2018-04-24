import type { CustomAction } from "./action"
import { MetaAction } from "./action"
import { ConsumerArgs } from "./listener"

type Data = {
    points: number,
}

export const bindFamePoints: Symbol = Symbol('bindFamePoints')
export const BindFamePoints: CustomAction<Data> = MetaAction(bindFamePoints, ({ game, data }: ConsumerArgs<Data>): void => {
    game.famePoints += Math.floor(data.points)
})
