import { CardLibrary } from '../cardLibrary'
import { Character } from '../../character'

// block and ward effects. apply debuffs to self... or not.

// Blockade (only lose half of block on turn start) singleton
// Slam- deal damage to a target equal to amount of block
// deal damage, gain block
// gain block, become spiky
// defend

// gain block and ward
// when ward blocks an effect, apply the effect to foes? deal damage? gain energy? draw cards?
// remove all ward. Draw a card per ward removed. (gain 1 energy? singleton?)
// apply 2 vulnerability and latency to all creatures
// deal damage. on damage, gain ward

// gain vulnerability. gain block.
// gain latency. deal damage.
// get rid of vulnerability and latency, gain 2 ward, singleton

const argus = new Character(
  'Argus',
  true,
  '#d87804',
  'Government sponsored security software.'
)

CardLibrary.register(argus)
