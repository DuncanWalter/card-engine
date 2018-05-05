import type { Component } from '../component'
import { Component as PreactComponent } from 'preact'

const updaters = new Set()

let time = Date.now(), hash = 10, delta = 0.017
requestAnimationFrame(function loop(){ 

    let newTime = Date.now()
    delta = (newTime - time) / 1000
    time = newTime
    hash = (hash + 1) % 1024

    updaters.forEach(updater => updater(hash))

    requestAnimationFrame(loop)
})

export function registerUpdate(callback: (hash: number) => any){
    updaters.add(callback)
}


export const withAnimation = (component: Component<any>) => {
    class Animated extends PreactComponent {
        shouldComponentUpdate(nextState){
            return this.state.hash != hash || nextState.hash == hash
        }
        componentWillMount(){
            this.state.hash = hash - 1    
            this.state.updater = hash => {
                this.setState({ hash })
            }
            updaters.add(this.state.updater)
        }
        componentWillUnmount(){
            updaters.delete(this.state.updater)
        }   
        render(props){
            return component({ ...props, delta: delta })
        }
    }
    return (props: any) => <Animated { ...props }/>
}

let frameEdits = new Set()
registerUpdate(hash => {
    frameEdits.forEach(edit => {
        edit()
    })
    frameEdits = new Set()
})

// TODO: redo this cleaner, potentially actually passing update through
export const overStream = <P: Object, S: Object>(stream: any, propName: string, initial?: any) => (component: Component<P>): Component<P> => {

    let value = initial
    let valueStream = stream.skipDuplicates()
    valueStream.onValue(v => value = v)

    class Stream extends PreactComponent<P, S> {
        componentDidMount(){
            this.forceUpdateHandler = v => frameEdits.add(hash => this.setState({ [propName]: v }))
            valueStream.onValue(this.forceUpdateHandler)
        }
        componentWillUnmount(){
            valueStream.offValue(this.forceUpdateHandler)
        }
        render(props){
            return component({ ...props, [propName]: value })
        }
    }

    return props => <Stream {...props}/>
    
}