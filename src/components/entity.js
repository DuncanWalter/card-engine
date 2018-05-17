// import { Component } from 'preact'
// import { resolver } from '../events/eventResolver'
// import { dispatch } from '../state';


// export class Entity extends Component {
    
//     state: {
//         cache: any,
//         lastTick: number,
//         callback: (value: any) => any
//     }

//     // onComponentDidMount(el: any): void {
//     //     animationTimer.stream.onValue(this.state.callback)
//     //     this.state = {
//     //         lastTick: -1,
//     //         cache: null,
//     //         callback: value => setImmediate(() => this.setState({ value })),
//     //     }
//     // }

//     // componentWillUnmount(){
//     //     animationTimer.stream.offValue(this.state.callback)
//     // }

//     render({ entity, children }: *){
//         // TODO: animations currently disable entity operations
//         let animations = resolver.animations.get(entity)
//         if(animations){
//             this.state.cache = [... animations].reduce((acc, ani) => 
//                 // TODO: get actual delta times here
//                 ani.update(0.00166, children)
//             )
//             return <div>{this.state.cache}</div>
//         } else {
//             return <div
//                 onClick={e => dispatch({ type: 'pushEntity', target: entity })}
//                 onMouseEnter={e => dispatch({ type: 'setCursorFocus', target: entity })}
//                 onMouseLeave={e => dispatch({ type: 'unsetCursorFocus', target: entity })}
//             >{
//                 children
//             }</div>
//         }
//     }
// }









