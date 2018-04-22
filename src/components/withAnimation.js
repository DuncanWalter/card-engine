import type { Component } from '../component'
import { overStream } from "./overStream";
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


