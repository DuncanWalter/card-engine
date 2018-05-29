import { CardLibrary } from "../cardLibrary"
import { CardPool } from "../cardPool"
import { Strike, StrikeL, StrikeR } from "./strike"
import { Defend, DefendL, DefendR } from "./defend"
import { Bash } from "./bash"
import { Acid } from "./acid"
import { Cleave } from "./cleave"
import { Character, F, D, C } from "../../character";
import { LookAhead } from "../../pragmas/lookAhead";
import { Snapshot } from "../../pragmas/snapshot";


// strike
// block
// dodge

// trip
// blind
// ward

// finesse
// flash of steel
// enlightenment
// apotheosis


let adventurer = new Character('Adventurer', false, '#6f6f76', 'Basic set of cards available to all adventurers.')

adventurer.addCard(F, Defend, DefendL, DefendR)
adventurer.addCard(F, Strike, StrikeL, StrikeR)

adventurer.addCard(D, Bash)
adventurer.addCard(D, Cleave)

adventurer.addCard(C, Acid)

adventurer.addPragma(LookAhead)
adventurer.addPragma(Snapshot)

CardLibrary.register(adventurer)
