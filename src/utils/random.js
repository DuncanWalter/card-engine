
let ring = (0x1 << 30) - 1
// let state = Math.abs(Math.floor(Math.random() * (ring + 1)))

function xorshift64(seed){
    let __seed__ = seed
	__seed__ ^= __seed__ >> 12
	__seed__ ^= __seed__ << 25
    __seed__ ^= __seed__ >> 27
	return Math.abs((__seed__ * 0x2545F4914F6CDD1D) % ring)
}

// export function seed(){
//     return (state = xorshift64(state)) / ring
// }

// export function next(seed: number){
//     return xorshift64(ring * seed) / ring 
// }



export class Random {

    fork: () => Random
    next: () => number

    constructor(seed: number){
        let state = seed
        this.fork = () => new Random(state)
        this.next = () => (state = xorshift64(ring * state)) / ring 
    }

}



