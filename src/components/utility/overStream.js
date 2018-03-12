import { compose, withLifecycle, withState } from 'incompose'
import type { Component } from '../component'
import type { Slice } from '../../utils/state'
import { Component as InComponent } from 'inferno';

// TODO: redo this cleaner, potentially actually passing update through
export const overStream = <P: Object, S: Object>(stream: any, name: string) => (component: Component<P>): Component<P> => {

    return class extends InComponent<P, S> {
        state = {
            value: null,
            callback: (value) => setImmediate(() => this.setState({ value })),
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
    
    // let callback = () => update()
    // let update = () => undefined
    
    // let streamManaged = withLifecycle({
    //     componentDidMount: el => {
    //         slice.stream.onValue(callback)
    //     },
    //     componentWillUnmount: () => {
    //         slice.stream.offValue(callback)
    //     },
    // })

    // let stateful = withState(name, 'update', slice.state)

    // let updateHooked = component => props => {
    //     let u = props.update
    //     update = () => u(s => s)
    //     delete props.update
    //     return component(props)
    // }

    // return compose(streamManaged, stateful, updateHooked)(component)
}