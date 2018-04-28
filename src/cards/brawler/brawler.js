import { CardLibrary, F, D, C, B, A } from "../cardLibrary"
import { CardPool } from "../cardPool"
import { PalmStrike } from "./palmStrike";
import { Anger } from "./anger";
import { FightersStance } from "./fightersStance";
import { Rage } from "./rage";
import { DoubleStrike } from "./doubleStrike";
import { Adrenaline } from "./adreneline";
import { FlashOfSteel } from "./flashOfSteel"
import { Rampage } from "./rampage";
import { TripleStrike } from "./tripleStrike";
import { Flex } from "./flex";
import { LegReap } from "./LegReap";
import { CheapShot } from "./cheapShot";

// motion blur
// momentum
// improvise???
// quick strike
// sweeping strike
// flurry (double sweep)
// finisher
// battle rythm (draw for vulnerability or dazed)
// reckless strike (attack for dazed)
// crippling strike (cheap shot)
// stimulants
// numbness ???
// thunderclap
// flying knee (spinning backhand)
// reckless charge
// burst / double tap

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
brawlerD.add(CheapShot)
brawler.register(D, brawlerD)

// Grade C Brawler cards
let brawlerC = new CardPool()
brawlerC.add(DoubleStrike)
brawlerC.add(Flex)
brawlerC.add(LegReap)
brawlerC.add(Rage)
brawlerC.add(Rampage)
brawler.register(C, brawlerC)

// Grade B 
let brawlerB = new CardPool()
brawlerB.add(Adrenaline)
brawlerB.add(TripleStrike)
brawler.register(B, brawlerB)

// Grade A
let brawlerA = new CardPool()
brawlerA.add(FlashOfSteel)
brawler.register(A, brawlerA)

CardLibrary.register('brawler', brawler)








// distros over disjoint sets
// set unions for any sets