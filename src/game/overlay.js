import { Modal } from '../utility'
import { Route, Switch } from 'react-router-dom'
import { history } from '../utils/navigation'
import React, { type Element } from 'react'

// const overlays = new Map()
const contexts = new Map()

// export type Overlay<A: Object, R> = (args: A) => Promise<R>
export function registerOverlay<A: Object, R>(
  Component: (props: { ...A, resolve: (R) => any, match: any }) => Element<any>
): (args: A) => Promise<R> {
  // const overlay = genKey()
  // overlays.set(overlay, component)
  return (args: A) =>
    new Promise((__resolve__) => {
      // TODO: not an acceptable id generator
      const context = 'ctx' + ((Math.random() * 2048) | 0).toString()
      console.log(context)
      const resolve = (val) => {
        history.goBack()
        contexts.delete(context)
        __resolve__(val)
      }
      contexts.set(context, {
        args,
        resolve,
        Component,
      })
      history.push(`ctx/${context}/`)
    })
}

type OverlayContextProps = {
  match: { url: string },
  children: Element<any> | Element<any>[],
}
export function OverlayContext({ match, children }: OverlayContextProps) {
  // TODO: title text and exit button?
  // TODO: back/confirm?

  console.log('Overlay Begin')
  return (
    <Switch>
      <Route
        path={`${match.url}/ctx/:context/`}
        render={({ match }) => {
          const context = contexts.get(match.params.context)
          if (context) {
            const { Component, resolve, args } = context
            console.log('Known overlay context referenced', Component)
            return (
              <OverlayContext match={match}>
                <Component {...args} match={match} resolve={resolve} />
              </OverlayContext>
            )
          } else {
            console.log('Unknown overlay context referenced')
            return <div>{children || null}</div>
          }
        }}
      />
      <Route
        render={() => (Array.isArray(children) ? children[0] : children)}
      />
    </Switch>
  )
}
