import type { CustomAction } from "./action"
import { MetaAction } from "./action"
import { ConsumerArgs } from "./listener"

type Data = {
    quantity: number,
}

export const bindEnergy: Symbol = Symbol('bindEnergy')
export const BindEnergy: CustomAction<Data> = MetaAction(bindEnergy, ({ game, data }: ConsumerArgs<Data>): void => {
    game.player.energy += Math.floor(data.quantity)
})
