import type { ID } from "../utils/entity"
import { Pragma, PragmaState } from "./pragma";
import { EntityGroup } from "../utils/entityGroup";
import { randomSequence } from "../utils/random";

export class PragmaGroup extends EntityGroup<Pragma> {
    
    seed: number | void

    constructor(pragmas: ID<PragmaState>[], seed?: number){
        super(Pragma, pragmas)
        this.seed = seed
    }

    next(): Pragma {
        if(this.seed !== undefined){
            const seq = randomSequence(this.seed)
            const trg = new Pragma(this.ids[Math.floor(this.size*seq.next())])
            this.seed = seq.last()
            this.remove(trg)
            return trg
        } else {
            // TODO: return a dummy thingy
            throw new Error(`Cannot get next pragma from an unseeded pragma group`)
        } 
    }
}