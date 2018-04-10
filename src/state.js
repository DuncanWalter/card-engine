import { combineSlices } from "./utils/state"
import { gameSlice } from "./game/gameState"
import { entitySlice } from "./components/entity"

export const { state, stream } = combineSlices({
    game: gameSlice,
    entity: entitySlice,
    // settings
    // user
    // menu
})