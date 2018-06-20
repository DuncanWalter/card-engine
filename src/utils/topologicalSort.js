import { LL } from './linkedList'

const Z = new Set()

type Elem<Id> = {
  id: Id,
  children: Array<Id>,
  parents: Array<Id>,
  compare(e: Elem<Id>): -1 | 0 | 1,
}

type ElemWrapper<Id> = {
  elem: Elem<Id>,
  header: {
    parents: Set<ElemWrapper<Id>>,
    children: Set<ElemWrapper<Id>>,
  },
}

function insert<Id>(e: ElemWrapper<Id>, l: LL<ElemWrapper<Id>>): void {
  let v = l.view()
  while (v.list[0]) {
    if (e.elem.compare(v.list[0].elem) < 0) {
      v.next()
    } else {
      break
    }
  }
  v.push(e)
}

export function topologicalSort<T, Id>(
  elements: Array<T & Elem<Id>>
): Array<T & Elem<Id>> {
  const elementMap: Map<Id, ElemWrapper<Id>> = new Map(
    elements.map((e) => [
      e.id,
      {
        elem: e,
        header: {
          parents: new Set(),
          children: new Set(),
        },
      },
    ])
  )

  elementMap.forEach((e: ElemWrapper<Id>) => {
    // $FlowFixMe
    e.header.parents = new Set(e.elem.parents.map((p) => elementMap.get(p)))
    // $FlowFixMe
    e.header.children = new Set(e.elem.children.map((c) => elementMap.get(c)))
  })

  elementMap.forEach((e: ElemWrapper<Id>) => {
    e.header.parents.forEach((p) => {
      p.header.children.add(e)
    })
    e.header.children.forEach((c) => {
      c.header.parents.add(e)
    })
  })

  let available: LL<ElemWrapper<Id>> = elements
    .map((e: *) => elementMap.get(e.id))
    .filter((e) => e && !e.header.parents.size)
    // $FlowFixMe
    .sort((a: *, b: *) => a.elem.compare(b.elem))
    .reduce((a, m) => {
      if (m) {
        a.append(m)
      }
      return a
    }, new LL())

  let next: ElemWrapper<Id> | null,
    retVal: Array<Elem<Id>> = []
  while ((next = available.next())) {
    next.header.children.forEach((c) => {
      // $FlowFixMe
      c.header.parents.delete(next)
      if (!c.header.parents.size) {
        insert(c, available)
      }
    })
    retVal.push(next.elem)
  }

  return (retVal: any)
}
