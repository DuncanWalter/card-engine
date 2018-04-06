import { NPC } from "../creatures/npc"
import { Turtle } from "../creatures/turtle/turtle"
import { Cobra } from "../creatures/cobra/cobra"
import { Toad } from "../creatures/toad/toad"


function randomEnemy(seed){
    switch(true){
        case seed < 0.3333: {
            return [new Turtle(15)]
        }
        case seed < 0.6666: {
            return [new Cobra(30)]
        }
        case seed < 1.0000: {
            return [new Toad(15), new Toad(15)]
        } 
    }
}


export class Path {
    
    // 
    // rewards: Reward[]
    
    // 
    challengeRating: number
    enemies: NPC[]

    // number of available exits
    freedoms: number

    // 
    constructor(){
        this.enemies = [
            ...randomEnemy(Math.random()), 
            ...randomEnemy(Math.random()),
        ]
    }

}
