import { combineSlices } from "./utils/state";
import { gameSlice } from "./game/gameState";
import { entitySlice } from "./components/entity";
// import { viewSlice } from "./game/viewState";

export const { state, stream } = combineSlices({
    game: gameSlice,
    entity: entitySlice,
    // view: viewSlice, // TODO: is needed?
    // settings
    // user
    // menu
})