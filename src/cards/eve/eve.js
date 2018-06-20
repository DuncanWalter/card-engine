import { CardLibrary } from '../cardLibrary'
import { CardPool } from '../cardPool'
import { PalmStrike } from './palmStrike'
import { Needle, NeedleWithCache } from './needle'
import { FightersStance } from './fightersStance'
import { DoubleStrike } from './doubleStrike'
import { Adrenaline } from './adreneline'
import { FlashOfSteel } from './flashOfSteel'
import { Rampage } from './rampage'
import { TripleStrike } from './tripleStrike'
import { Flex, FlexPermanent, FlexImproved } from './flex'
// import { LegReap } from "./LegReap";
import { ChipShot } from './chipShot'
import { Character, F, D, C, B, A } from '../../character'
import { Strike } from '../adventurer/strike'
import { Encroach } from './encroach'
import { Crack } from './crack'
import { Expose } from './expose'
import { Replay } from './replay'
import { Deduce } from './deduce'
import { Penetrate } from '../alonzo/penetrate'
import { Exploit } from './exploit'
import { SideChannel } from '../anansi/sideChannel'

// momentum - every xth damage deal, gain energy
// quick strike
// add cleave?
// flurry (double sweep) A
// battle rythm (draw for vulnerability or dazed) C
// flying knee (spinning backhand)
// burst / double tap A

// Get the gash thingy running (strike name thing but better thought out)

// heal when taking damage?
// footwork?
// nimbleness (metalisize)

// skewer thingy => whirlwind, or deal randomly but + 2 times
//

let eve = new Character(
  'Eve',
  true,
  '#d31313',
  'Espionage software designed by an intelligence agency to run with limited system resources on foreign machines. Excels at executing multi-pronged attacks, but lacks facilities for protecting sensitive data.'
)

eve.addCard(F, Strike, (card) => new DoubleStrike(), (card) => new PalmStrike())

eve.addCard(D, ChipShot)
eve.addCard(D, FightersStance)
eve.addCard(D, Needle, NeedleWithCache)
eve.addCard(D, PalmStrike, (card) => new Exploit() /*, Improved*/)
eve.addCard(D, SideChannel) // TODO: look into replacing w/ cleave etc

eve.addCard(C, Crack /*expense add cache, improved*/)
eve.addCard(C, DoubleStrike, (card) => new TripleStrike())
eve.addCard(C, Encroach /*EncroachRedundancy, EnchroachImproved*/)
eve.addCard(C, Expose /*ExposeSingleton, ExposeAll*/)
eve.addCard(C, Flex, FlexPermanent, FlexImproved)

eve.addCard(B, Exploit, (card) => new FlashOfSteel() /*  */)
eve.addCard(B, Penetrate /*improved*/)
eve.addCard(B, Rampage /*With Default, Harder scaling*/)
eve.addCard(B, Replay /*Hand, Improved*/)
eve.addCard(B, TripleStrike /*random by 5, quadstrike rename*/)

eve.addCard(A, Adrenaline /*self harming non single, improved*/)
eve.addCard(A, Deduce /*random flurry, area attack (single? expensive?)*/)
eve.addCard(A, FlashOfSteel /*improved*/)
// singleton this turn, draw on damage. => this turn, gain energy on damage, draw costs you?

CardLibrary.register(eve)
