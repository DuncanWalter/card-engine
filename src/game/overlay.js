import { Modal } from "../utility";
import { Route, Switch } from 'react-router-dom'
import { Component } from "preact";
import { history } from "../utils/navigation";

// const overlays = new Map()
const contexts = new Map()

// export type Overlay<A: Object, R> = (args: A) => Promise<R> 

export function registerOverlay<A: Object, R>(Component: (props: { ...A, resolve: R => any, match: any }) => Component): (args: A) => Promise<R> {
    // const overlay = genKey()
    // overlays.set(overlay, component)
    return (args: A) => new Promise(__resolve__ => {
        // TODO: not an acceptable id generator
        const context = 'ctx' + ((Math.random() * 2048) | 0).toString()
        console.log(context)
        const resolve = val => {
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

export function OverlayContext({ match, children }: any){
    // TODO: title text and exit button?
    // TODO: back/confirm?
    return <Switch>
        <Route path={`${match.url}/ctx/:context/`} render={ ({ match }) => {
            const context = contexts.get(match.params.context)
            if(context){
                const { Component, resolve, args } = context
                return <OverlayContext match={ match }>
                    {/* should not display children */}
                    {/* { children } */}
                    {/* <Modal> */}
                        <Component { ...args } match={ match } resolve={ resolve }/>
                    {/* </Modal> */}
                </OverlayContext>
            } else {

                console.log('Unknown overlay context referenced')
                return <div>{ children }</div>
            }
        }}/>
        <Route render={ () => children[0] }/>
    </Switch>
}

