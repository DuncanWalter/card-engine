import type { ID } from '../utils/entity'
import { Pragma, PragmaState } from './pragma'
import { EntityGroup } from '../utils/entityGroup'
import { randomSequence, Sequence } from '../utils/random'

export class PragmaGroup extends EntityGroup<Pragma> {
  static Subset = Pragma

  constructor(pragmas: Pragma[]) {
    super(pragmas)
  }

  next(seed: Sequence<number>): Pragma {
    const trg = this.entities[Math.floor(this.size * seed.next())]
    this.remove(trg)
    return trg
  }
}
