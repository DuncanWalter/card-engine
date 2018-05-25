import { CardLibrary } from "../cardLibrary"
import { CardPool } from "../cardPool"
import { Strike } from "./strike"
import { Defend } from "./defend"
import { Bash } from "./bash"
import { Acid } from "./acid"
import { Cleave } from "./cleave"
import { Character, F, D, C } from "../../character";
import { LookAhead } from "../../pragmas/lookAhead";


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

adventurer.addCard(F, Defend)
adventurer.addCard(F, Strike)

adventurer.addCard(D, Bash)
adventurer.addCard(D, Cleave)

adventurer.addCard(C, Acid)

adventurer.addPragma(C, LookAhead)

CardLibrary.register(adventurer)








