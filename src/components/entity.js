import { Component } from "preact"
import { animationTimer } from "./withAnimation";
import { resolver } from "../actions/actionResolver";

export class Entity extends Component {
    
    state: {
        cache: any,
        lastTick: number,
        callback: (value: any) => any
    }

    onComponentDidMount(el: any): void {
        // $FlowFixMe
        Object.defineProperty(this, 'position', {
            get(){
                return el
            }
        })
        animationTimer.stream.onValue(this.state.callback)
        this.state = {
            lastTick: -1,
            cache: null,
            callback: value => setImmediate(() => this.setState({ value })),
        }
    }

    componentWillUnmount(){
        animationTimer.stream.offValue(this.state.callback)
    }

    render({ entity, children }: *){
        if(animationTimer.state.hash == this.state.lastTick){
            // console.log('so gloriously efficient!!!')
            return <div>{this.state.cache}</div>
        } else {
            let animations = resolver.animations.get(entity)
            if(animations){
                this.state.cache = [... animations].reduce((acc, ani) => 
                    ani.update(animationTimer.state.delta, children)
                )
                return <div>{this.state.cache}</div>
            } else {
                // console.log('CLEVERNESS IS NEVER BAD, RIGHT?')
                return <div>{children}</div>
            }
        }
    }
}