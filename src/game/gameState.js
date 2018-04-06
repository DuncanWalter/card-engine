import { battleSlice } from "./battle/battleState";
import { combineSlices } from "../utils/state";
import { handSlice } from "./hand/handState";


export const gameSlice = combineSlices({
    battle: battleSlice,
    hand: handSlice,
})