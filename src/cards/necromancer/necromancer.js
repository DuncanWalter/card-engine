import { CardSet } from "../cardSet";
import { CardLibrary } from "../cardLibrary";
import { Daemon } from "./daemon";
import { MarkForDeath } from "./markForDeath";

let necromancer = new CardSet('Necromancer', true, '#670467', 'Offence-oriented summoner cards.')

necromancer.add('D', Daemon)

necromancer.add('C', MarkForDeath)

CardLibrary.register(necromancer)
