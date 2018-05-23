import type { MonsterState } from './monster'
import type { ID } from '../utils/entity'
import { Monster } from "./monster"
import { Entity } from "../utils/entity"
import { EntityGroup } from "../utils/entityGroup";

export class MonsterGroup extends EntityGroup<Monster> {

    monsters: ID<MonsterState>[]

    constructor(monsters: ID<MonsterState>[]){
        super(Monster, monsters)
    }

}