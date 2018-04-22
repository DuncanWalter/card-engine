import { CardPool } from "./cardPool"

export type Grade = 1 | 2 | 3 | 4 | 5

export const F: Grade = 1 // Strike, Defend, Dodge
export const D: Grade = 2 // 
export const C: Grade = 3 // 
export const B: Grade = 4 // FOS
export const A: Grade = 5 // Apo, Enlightenment

export const CardLibrary: CardPool<string, CardPool<Grade, CardPool<>>> = new CardPool()
