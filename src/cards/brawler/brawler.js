import { CardLibrary } from "../cardLibrary"
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
import { CardSet } from "../cardSet";
import { Strike } from "../adventurer/strike";

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

let brawler = new CardSet('Brawler', '#7a190b', 'Offense-focused combo cards.')

brawler.add('F', Strike)

brawler.add('D', Anger)
brawler.add('D', CheapShot)
brawler.add('D', FightersStance)
brawler.add('D', PalmStrike)

brawler.add('C', DoubleStrike)
brawler.add('C', Flex)
brawler.add('C', LegReap)
brawler.add('C', Rage)
brawler.add('C', Rampage)

brawler.add('B', Adrenaline)
brawler.add('B', TripleStrike)

brawler.add('A', FlashOfSteel)

CardLibrary.register(brawler)








// distros over disjoint sets
// set unions for any sets