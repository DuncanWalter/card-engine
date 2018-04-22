import { CardLibrary, F, D, C, B, A } from "../cardLibrary"
import { CardPool } from "../cardPool"
import { Strike } from "./strike"
import { Defend } from "./defend"
import { Bash } from "./bash"
import { Footwork } from "./footwork"
import { Acid } from "./acid"
import { FlashOfSteel } from "./flashOfSteel"
import { Cleave } from "./cleave"


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


let adventurer = new CardPool()

// Grade C Adventurer cards
let adventurerC = new CardPool()
adventurerC.add(Defend)
adventurerC.add(Strike)
adventurer.register(C, adventurerC)

// Grade B Adventurer cards
let adventurerB = new CardPool()
adventurerB.add(Acid)
adventurerB.add(Bash)
adventurerB.add(Cleave)
adventurer.register(B, adventurerB)

// Grade A Adventurer cards
let adventurerA = new CardPool()
adventurerA.add(FlashOfSteel)
adventurerA.add(Footwork)
adventurer.register(A, adventurerA)

CardLibrary.register('adventurer', adventurer)








