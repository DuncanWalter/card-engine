import { Character, D, C } from '../../character'
import { CardLibrary } from '../cardLibrary'
import { Daemon } from './daemon'
import { MarkForDeath } from './markForDeath'

// orb- similar
//  => split five damage equally among all foes + focus
// dark- similar. rarer.
//  =>
// plasma- similar
// frost- similar
//  => gain thorns on evoke frost
// blood- save hp value, heal to value on evoke?
//

// recursion
// zap
// double-cast => multicast
// fusion
// impulse
//

let prometheus = new Character(
  'Prometheus',
  true,
  '#2b990a',
  'A recently discovered entity emergent from the complexity of the global network. Capable of completing complicated tasks using computing primitives in novel ways, and therefore a subject of much study. Unsettlingly, also seems capable of some agency.'
)

prometheus.addCard(D, Daemon)

prometheus.addCard(C, MarkForDeath)

CardLibrary.register(prometheus)
