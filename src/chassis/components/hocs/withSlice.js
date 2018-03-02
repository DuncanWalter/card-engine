import { compose, withLifecycle, withState } from 'incompose'
import type { Component } from '../component'
import type { StateSlice } from '../../../core/state'

// TODO: redo this cleaner, potentially actually passing update through
export const withSlice = (slice: StateSlice<>, name: string) => function<P>(component: Component<P>): Component<P> {

    let callback = () => update();
    let update = () => undefined;
    
    let streamManaged = withLifecycle({
        componentDidMount: el => {
            slice.stream.onValue(callback)
        },
        componentWillUnmount: () => {
            slice.stream.offValue(callback);
        },
    });

    let stateful = withState(name, 'update', slice);

    let updateHooked = component => props => {
        let u = props.update;
        update = () => u(s => s);
        delete props.update;
        return component(props);
    }

    return compose(streamManaged, stateful, updateHooked)(component);
}