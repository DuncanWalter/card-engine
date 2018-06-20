let ring = (0x1 << 30) - 1
// let state = Math.abs(Math.floor(Math.random() * (ring + 1)))

function xorshift64(seed) {
  let __seed__ = seed
  __seed__ ^= __seed__ >> 12
  __seed__ ^= __seed__ << 25
  __seed__ ^= __seed__ >> 27
  return Math.abs((__seed__ * 0x2545f4914f6cdd1d) % ring)
}

export interface Sequence<T> {
  fork: () => Sequence<T>;
  next: () => T;
  last: () => T;
}

export function randomSequence(seed: number): Sequence<number> {
  let state: number = seed
  let sequence = {}
  sequence.fork = () => randomSequence(state)
  sequence.next = () => (state = xorshift64(ring * state)) / ring
  sequence.last = () => state
  return sequence
}
