import { Sequence } from "../utils/random"
import { Monster } from "../creatures/monster"

interface Encounter {
    challengeRating: number,
    enemies: ((seed: Sequence<number>) => Monster)[],
}

const encounterLibrary: Encounter[] = []

export function registerEncounter(challengeRating: number, ...enemies: ((seed: Sequence<number>) => Monster)[]){
    encounterLibrary.push({
        challengeRating,
        enemies,
    })
}

export function getEncounter(level: number, seed: Sequence<number>){
    let encounters = encounterLibrary.filter(encounter => 
        Math.abs(encounter.challengeRating - level - 10) < (1.95 + level / 7) 
    )
    let encounter = encounters[Math.floor(seed.next() * encounters.length)]
    return {
        challengeRating: encounter.challengeRating,
        enemies: encounter.enemies.map(Monster => new Monster(seed)),
    }
}