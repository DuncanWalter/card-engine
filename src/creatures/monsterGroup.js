import type { MonsterState } from './monster'
import type { ID } from '../utils/entity'
import { Monster } from './monster'
import { Entity } from '../utils/entity'
import { EntityGroup } from '../utils/entityGroup'

export class MonsterGroup extends EntityGroup<Monster> {
  static Subset = Monster
  monsters: ID<MonsterState>[]

  constructor(monsters: Monster[]) {
    super(monsters)
  }
}
