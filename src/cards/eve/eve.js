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

// Get the gash thingy running (strike name thing but better thought out)

// heal when taking damage?
// footwork?
// nimbleness (metalisize)
// pocket sand!!! 
// headbutt?

// jab

let eve = new CardSet('Eve', true, '#7a190b', 'Espionage software designed by an intelligence agencies to run with limited system resources on foreign machines. Excels at executing many, simple attacks, but lacks facilities for protecting sensitive data.')

eve.add('F', Strike)

eve.add('D', Anger)
eve.add('D', CheapShot)
eve.add('D', FightersStance)
eve.add('D', PalmStrike)

eve.add('C', DoubleStrike)
eve.add('C', Flex)
eve.add('C', LegReap)
eve.add('C', Rage)
eve.add('C', Rampage)

eve.add('B', Adrenaline)
eve.add('B', TripleStrike)

eve.add('A', FlashOfSteel)

CardLibrary.register(eve)
