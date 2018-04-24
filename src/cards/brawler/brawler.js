import { CardLibrary, F, D, C, B, A } from "../cardLibrary"
import { CardPool } from "../cardPool"
import { PalmStrike } from "./palmStrike";
import { Anger } from "./anger";
import { FightersStance } from "./fightersStance";
import { Rage } from "./rage";
import { DoubleStrike } from "./doubleStrike";
import { Adrenaline } from "./adreneline";
import { FlashOfSteel } from "./flashOfSteel"


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

// Grade D Brawler cards
let brawlerD = new CardPool()
brawlerD.add(Anger)
brawlerD.add(FightersStance)
brawlerD.add(PalmStrike)
brawler.register(D, brawlerD)

// Grade C Brawler cards
let brawlerC = new CardPool()
brawlerC.add(Rage)
brawlerC.add(DoubleStrike)
brawler.register(C, brawlerC)

// Grade B 
let brawlerB = new CardPool()
brawlerB.add(Adrenaline)
brawler.register(B, brawlerB)

// Grade A
let brawlerA = new CardPool()
brawlerA.add(FlashOfSteel)
brawler.register(A, brawlerA)

CardLibrary.register('brawler', brawler)








// distros over disjoint sets
// set unions for any sets