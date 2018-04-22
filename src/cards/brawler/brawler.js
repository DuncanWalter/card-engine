import { CardLibrary, C, B, A } from "../cardLibrary";
import { CardPool } from "../cardPool";
import { Strike } from "./strike";
import { Defend } from "./defend";
import { Bash } from "./bash";
import { Footwork } from "./footwork";
import { Acid } from "./acid";
import { FlashOfSteel } from "./flashOfSteel";
import { Cleave } from "./cleave";



// rampage
// double strike
// triple strike
// rage () -> perma
// momentum
// fighter's stance (cloak and dagger)
// improvise???
// quick strike
// flash of steel
// flex
// sweeping strike
// flurry (double sweep)
// finisher
// battle rythm (draw for vulnerability or dazed)
// reckless strike (attack for dazed)
// anger
// crippling strike (cheap shot)
// adreneline
// stimulants
// numbness ???
// thunderclap
// flying knee (spinning backhand)
// heelhook / dropkick

// heal when taking damage?
// footwork?
// nimbleness (metalisize)
// pocket sand!!! 
// headbutt?

// jab


let brawler = new CardPool()

// Grade F Brawler cards
let brawlerF = new CardPool()
// brawlerF.add(Defend)
// brawlerF.add(Strike)
brawler.register(C, brawlerF)

// Grade D Brawler cards
let brawlerD = new CardPool()
// brawlerD.add(Acid)
// brawlerD.add(Bash)
// brawlerD.add(Cleave)
brawler.register(B, brawlerD)

// Grade C Brawler cards
let brawlerC = new CardPool()
adventurerA.add(FlashOfSteel)
adventurerA.add(Footwork)
adventurer.register(A, adventurerA)

// Grade B 
let brawlerC = new CardPool()


let brawlerC = new CardPool()


CardLibrary.register('adventurer', adventurer)








