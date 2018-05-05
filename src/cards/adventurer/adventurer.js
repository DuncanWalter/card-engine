import { CardLibrary } from "../cardLibrary"
import { CardPool } from "../cardPool"
import { Strike } from "./strike"
import { Defend } from "./defend"
import { Bash } from "./bash"
import { Acid } from "./acid"
import { FlashOfSteel } from "../brawler/flashOfSteel"
import { Cleave } from "./cleave"
import { CardSet } from "../cardSet";


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


let adventurer = new CardSet('Adventurer', false, '#6f6f76', 'Basic set of cards available to all adventurers.')

adventurer.add('F', Defend)
adventurer.add('F', Strike)

adventurer.add('D', Bash)
adventurer.add('D', Cleave)

adventurer.add('C', Acid)

CardLibrary.register(adventurer)








