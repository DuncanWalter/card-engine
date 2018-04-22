import type { Component } from '../component'
import type { Slice } from '../utils/state'
import { h, Component as PreactComponent } from 'preact'

// TODO: redo this cleaner, potentially actually passing update through
export const overStream = <P: Object, S: Object>(stream: any, propName: string) => (component: Component<P>): Component<P> => {

    let value = null
    let valueStream = stream.skipDuplicates()
    valueStream.onValue(v => value = v)

    class Stream extends PreactComponent<P, S> {
        componentDidMount(){
            this.forceUpdateHandler = v => setImmediate(() => this.setState({ [propName]: v }))
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








