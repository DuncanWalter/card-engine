type LLNode<E> = [E | null, LLNode<E> | false]

export class LL<E> {
  list: LLNode<E>
  last: LLNode<E>

  constructor(...elements: Array<E>) {
    this.list = [null, false]
    this.last = this.list
    elements.forEach((e) => this.append(e))
  }

  next(): E | null {
    const [v, l] = this.list
    if (l) this.list = l
    return v
  }

  push(v: E) {
    this.list[1] = [this.list[0], this.list[1]]
    this.list[0] = v
    if (this.list == this.last && this.list[1]) this.last = this.list[1]
  }

  unshift(v: E) {
    this.list = [v, this.list]
  }

  pop(): E | null {
    const [v, l] = this.list
    if (l) {
      this.list[0] = l[0]
      this.list[1] = l[1]
    } else {
      throw new Error('popped from an empty list')
    }
    return v
  }

  append(v: E) {
    this.last[0] = v
    this.last[1] = [null, false]
    this.last = this.last[1] ? this.last[1] : [null, false]
  }

  view(): LL<E> {
    let l = new LL()
    l.list = this.list
    l.last = this.last
    return l
  }

  appendList(list: LL<E>) {
    let [val, link] = list.list
    list.list = this.last
    this.last[0] = val
    this.last[1] = link
    this.last = link ? list.last : this.last
  }

  forEach(fn: (element: E, index: number, list: LL<E>) => void) {
    let n,
      i = 0,
      l = this.view()
    while ((n = l.next())) {
      fn(n, i++, l)
    }
  }

  map<R>(fn: (E) => R): LL<R> {
    const l = new LL()
    this.forEach((e) => l.append(fn(e)))
    return l
  }

  reduce<A>(fn: (acc: A, elem: E) => A, acc: A): A {
    let a = acc
    this.forEach((e) => {
      a = fn(a, e)
    })
    return a
  }

  toArray(): Array<E> {
    return this.reduce((a, e) => {
      a.push(e)
      return a
    }, [])
  }

  filter(pred: (elem: E) => boolean): LL<E> {
    const l = new LL()
    this.forEach((e) => (pred(e) ? l.append(e) : undefined))
    return l
  }

  // $FlowFixMe
  [Symbol.iterator]: any = iterator
}

function* iterator() {
  let l = this.list
  while (this.list[1]) {
    yield this.list[0]
    l = this.list[1]
  }
}
