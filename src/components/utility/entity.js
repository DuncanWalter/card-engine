import { Component } from "preact"
import { animationTimer } from "./withAnimation";
import { state as game } from "../battle/battleState";

export class Entity extends Component {
    
    state: {
        cache: any,
        lastTick: number,
        callback: (value: any) => any
    } = {
        lastTick: -1,
        cache: null,
        callback: value => setImmediate(() => this.setState({ value })),
    }

    onComponentDidMount(el: any): void {
        // $FlowFixMe
        Object.defineProperty(this, 'position', {
            get(){
                return el
            }
        })
        animationTimer.stream.onValue(this.state.callback)
    }

    componentWillUnmount(){
        animationTimer.stream.offValue(this.state.callback)
    }

    render({ entity, children }: *){
        if(animationTimer.state.hash == this.state.lastTick){
            console.log('so gloriously efficient!!!')
            return this.state.cache
        } else {
            let animations = game.resolver.animations.get(entity)
            if(animations){
                this.state.cache = [... animations].reduce((acc, ani) => 
                    ani.update(animationTimer.state.delta, children)
                )
            } else {
                console.log('so gloriously efficient!!!')
                return children
            }
        }
    }
}