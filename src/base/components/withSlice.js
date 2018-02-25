import { compose, withLifecycle, withState } from 'incompose'
import { StateSlice } from '../../core/state';


type WithSlice = (StateSlice<any, any>,  string) => any => any
export const withSlice: WithSlice = (slice, name) => component => {

    let callback = () => update();
    let update = () => undefined;
    
    let streamManaged = withLifecycle({
        componentDidMount: el => {
            // console.log('mounting');
            slice.stream.onValue(callback)
        },
        componentWillUnmount: () => {
            // console.log('unmounting');
            slice.stream.offValue(callback);
        },
    });

    let stateful = withState(name, 'update', slice.view());

    let updateHooked = component => props => {
        let u = props.update;
        update = () => u(s => s);
        delete props.update;
        console.log('hook props', props);
        return component(props);
    };

    return compose(streamManaged, stateful, updateHooked)(component);
}