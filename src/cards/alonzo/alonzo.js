import { Character, F, D, C, B, A } from '../../character'
import { CardLibrary } from '../cardLibrary'
import { Penetrate } from './penetrate'
import { Strike } from '../adventurer/strike'

// Strength, Self Damage, Healing

let alonzo = new Character(
  'Alonzo',
  true,
  '#3086ff',
  'A scientific tool intended to solve complex problems efficiently using its own understanding of mathematics. Usually used to study topics ranging from protein folding and traffic alleviation to macroeconomics and beyond.'
)

alonzo.addCard(F, Strike)

alonzo.addCard(B, Penetrate)

CardLibrary.register(alonzo)
