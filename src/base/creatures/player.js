import { Creature } from "./creature";

export class Player extends Creature {

    __energy__: number
    maxEnergy: number

    constructor(health: number, maxHealth?: number){
        super(health, maxHealth)
        this.maxEnergy = this.maxEnergy
        this.energy = this.maxEnergy
    }
    
    set energy(value: number){
        this.__energy__ = Math.floor(Math.max(0, Math.min(this.maxEnergy, value)))
    }

    get energy(): number {
        return this.__energy__
    }

}