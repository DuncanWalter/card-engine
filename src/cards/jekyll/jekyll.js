import { Character, F, D, C, B, A } from '../../character'
import { CardLibrary } from '../cardLibrary'
import { Footwork } from './footwork'
import { Backflip } from './backflip'
import { Defend } from '../adventurer/defend'
import { FightersStance } from '../eve/fightersStance'
import { Adrenaline } from '../eve/adreneline'

// gain block now and next turn
// gain block, do not lose it next turn
// deal damage per card played this turn
// draw 3, discard 1
// on discard self, gain energy. unplayable

// gain block, retain hand this turn
//

// latency works on damage not directed at self // TODO:
// vuln works on damage not sourced from self // TODO:
// thorny reflects all dmg from block? Belongs on argus maybe? Ticks down over time? // TODO:
//

let jekyll = new Character(
  'Jekyll',
  true,
  '#08aa90',
  'An intelligence created by anonymous (and evidently talented) hackers to oversee distributed network tasks and preserve operational secrecy. Copycat software backed by academics is now used almost ubiquitously, though the original is still used to protect secrets in the darker corners of the web.'
)

jekyll.addCard(F, Defend)

jekyll.addCard(D, Backflip)
jekyll.addCard(D, FightersStance)

jekyll.addCard(C, Footwork)

jekyll.addCard(A, Adrenaline)

CardLibrary.register(jekyll)
