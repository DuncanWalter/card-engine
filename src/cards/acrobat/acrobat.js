import { CardSet } from "../cardSet";
import { CardLibrary } from "../cardLibrary";
import { Footwork } from "./footwork";
import { Backflip } from "./backflip";
import { Defend } from "../adventurer/defend";

let acrobat = new CardSet('Acrobat', true, '#0b197a', 'Defence-oriented combo cards.')

acrobat.add('F', Defend)

acrobat.add('D', Backflip)

acrobat.add('C', Footwork)

CardLibrary.register(acrobat)
