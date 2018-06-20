import { Character, F, D, C, B, A } from '../../character'
import { CardLibrary } from '../cardLibrary'
import { HardwareFailure } from './hardwareFailure'
import { Deadlock } from './deadlock'
import { Interrupt } from './interupt'
import { MemoryLeak } from './memoryLeak'

const status = new Character('Status', false, '#494955', '')

status.addCard(D, HardwareFailure)
status.addCard(D, Deadlock)
status.addCard(D, Interrupt)
status.addCard(D, MemoryLeak)

CardLibrary.register(status)
