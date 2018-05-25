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
import { Character, F, D, C, B, A } from "../../character";
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

let eve = new Character('Eve', true, '#7a190b', 'Espionage software designed by an intelligence agencies to run with limited system resources on foreign machines. Excels at executing many, simple attacks, but lacks facilities for protecting sensitive data.')

eve.addCard(F, Strike)

eve.addCard(D, Anger)
eve.addCard(D, CheapShot)
eve.addCard(D, FightersStance)
eve.addCard(D, PalmStrike)

eve.addCard(C, DoubleStrike)
eve.addCard(C, Flex)
eve.addCard(C, LegReap)
eve.addCard(C, Rage)
eve.addCard(C, Rampage)

eve.addCard(B, Adrenaline)
eve.addCard(B, TripleStrike)

eve.addCard(A, FlashOfSteel)

CardLibrary.register(eve)
