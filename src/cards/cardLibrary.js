import { CardPool } from "./cardPool"

export type Grade = 1 | 2 | 3 

export const C: Grade = 1
export const B: Grade = 2
export const A: Grade = 3

export const CardLibrary: CardPool<string, CardPool<Grade, CardPool<>>> = new CardPool()
