import { SyncPromise } from '../utils/async'

export class Animation {
  update: (delta: number, children: any) => any

  finish: () => void
  finished: Promise<void>

  unblock: () => void
  unblocked: Promise<void>

  start: () => void
  started: Promise<void>

  constructor(
    focus: any,
    composer: (
      delta: number,
      children: any,
      unblock: () => void,
      finish: () => void
    ) => any
  ) {
    this.started = new SyncPromise((resolve) => {
      this.start = () => {
        resolve()
        this.start = () => undefined
      }
    })
    this.unblocked = new SyncPromise((resolve) => {
      this.unblock = () => {
        resolve()
        this.unblock = () => undefined
      }
    })
    this.finished = new SyncPromise((resolve) => {
      this.finish = () => {
        resolve()
        this.finish = () => undefined
      }
    })
    this.update = (delta, children) =>
      composer(delta, children, this.unblock, this.finish)
  }
}

// active animations will be a map from things animated to Sets of animations active. if the sets become empty, remove the key etc.
