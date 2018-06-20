import { topologicalSort } from './topologicalSort'
import React from 'react'

// TODO: clean this hideous file up
const modules: Map<string, Module> = new Map()

export type Global = {
  initialize: () => void,
  render: (props: any) => any,

  // properties are added by mods
  // may need to be of type any to get this all working
}

export type Context = {
  global: Global,
  next: () => void,
}

export type Consumer = (ctx: Context) => void

type LoadModules = (Array<Module>) => Global
export function loadModules(modules: Array<Module>) {
  const loadQueue = topologicalSort(modules)
  const global = {
    initialize: () => undefined,
    render: (props: any) => <p>Hello World!</p>,
  }
  let index = -1
  const next = () => {
    while (++index < loadQueue.length) {
      loadQueue[index].consumer({ global, next })
    }
  }

  next()

  global.initialize()

  return global
}

export class Module {
  parents: Array<string>
  children: Array<string>
  consumer: Consumer
  id: string

  constructor(
    id: string,
    consumer: Consumer,
    dependencies: Array<string>,
    dependents: Array<string>
  ) {
    this.parents = dependencies
    this.children = dependents
    this.id = id
    this.consumer = consumer
    modules.set(id, this)
  }

  compare(that: { id: string }) {
    return this.id > that.id ? 1 : -1
  }
}
