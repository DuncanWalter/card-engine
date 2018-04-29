import { Creature } from "./creature"

export class Player extends Creature {

    __energy__: number
    maxEnergy: number
    isActive: boolean
    sets: string[]
    
    constructor(health: number, maxHealth?: number, ...setNames: string[]){
        super(health, maxHealth)
        this.maxEnergy = 3 // TODO: how do energy stuffs?
        this.energy = this.maxEnergy
        this.color = '#4488dd'
        this.isActive = false
        this.sets = setNames
    }
    
    set energy(value: number){
        this.__energy__ = Math.floor(Math.max(0, Math.min(99, value)))
    }

    get energy(): number {
        return this.__energy__
    }

}