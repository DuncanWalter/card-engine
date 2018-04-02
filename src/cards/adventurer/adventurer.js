import { CardLibrary, C, B, A } from "../cardLibrary";
import { CardPool } from "../cardPool";
import { Strike } from "./strike";
import { Defend } from "./defend";
import { Bash } from "./bash";
import { Footwork } from "./footwork";
import { Acid } from "./acid";
import { FlashOfSteel } from "./flashOfSteel";

let adventurer = new CardPool()

// Grade C Adventurer cards
let adventurerC = new CardPool()
adventurerC.add(Strike)
adventurerC.add(Defend)
adventurer.register(C, adventurerC)

// Grade B Adventurer cards
let adventurerB = new CardPool()
adventurerB.add(Bash)
adventurerB.add(Acid)
adventurer.register(B, adventurerB)

// Grade A Adventurer cards
let adventurerA = new CardPool()
adventurerA.add(Footwork)
adventurerA.add(FlashOfSteel)
adventurer.register(A, adventurerA)

CardLibrary.register('adventurer', adventurer)








