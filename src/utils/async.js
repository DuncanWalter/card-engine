function any(any: any): any {
  return any
}

// TODO: make the api as true to form as possible
// So... we need to be able to run tasks that MAY be async synchronously if possible
export class SyncPromise<V> extends Promise<V> {
  result: Symbol | V
  awaiting: (V) => void

  constructor(resolver: (resolve: (value: V) => void) => void) {
    super((resolve) => undefined)
    const empty = Symbol('empty')
    const unit = () => undefined
    this.result = empty
    this.awaiting = unit
    // $FlowFixMe
    this.then = (onSuccess) => {
      if (this.result == empty) {
        this.awaiting = onSuccess
      } else {
        onSuccess(this.result)
      }
    }
    resolver((value) => {
      if (this.awaiting == unit) {
        this.result = value
      } else {
        this.awaiting(value)
      }
    })
  }
}

const GeneratorFunction = function* gen() {
  return
}.constructor

function next<R, B>(
  gen: Generator<Promise<B>, R, B>,
  resolve: (v: R) => void,
  prev?: B
): void {
  const { value, done } = gen.next(prev)

  if (done) return resolve(any(value))

  if (value instanceof Promise) {
    let isSynced = true
    value.then((value: B) => {
      // TODO:check if resolved. if not, setImediate
      if (isSynced) {
        next(gen, resolve, value)
      } else {
        setImmediate(() => next(gen, resolve, value))
      }
    })
    isSynced = false
  } else {
    throw new Error(`Yielded a non-promise in async function ${any(value)}`)
  }
}

type Synchronize = (
  (any[]) => Generator<any, any, any>
) => (any[]) => Promise<any>

type Fn<A, R> =
  | ((...args: A) => Promise<R>)
  | ((...args: A) => Generator<Promise<any>, R, any>)

// TODO: is there a way to make this express the stuff fully?
export function synchronize<A: any, R>(
  fun: Fn<A, R>
): (...args: A) => Promise<R> {
  return (...args: A) => {
    if (fun instanceof GeneratorFunction) {
      return new SyncPromise((resolve) => next(fun(...args), resolve))
    } else {
      // $FlowFixMe
      return new SyncPromise((resolve) => resolve(fun(...args)))
    }
  }
}
