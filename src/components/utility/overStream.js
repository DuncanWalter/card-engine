import type { Component } from '../component'
import type { Slice } from '../../utils/state'
import { h, Component as PreactComponent } from 'preact';

// TODO: redo this cleaner, potentially actually passing update through
export const overStream = <P: Object, S: Object>(stream: any, name: string) => (component: Component<P>): Component<P> => {

    return class extends PreactComponent<P, S> {
        state = {
            value: null,
            callback: value => setImmediate(() => this.setState({ value })),
        }
        componentDidMount(){
            stream.onValue(this.state.callback)
        }
        componentWillUnmount(){
            stream.offValue(this.state.callback)
        }
        render(props){
            return component({ ...props, [name]: this.state.value })
        }

    }
    
}








