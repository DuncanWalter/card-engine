import type { Component } from './component'
import { render } from 'preact'

import { Battle } from './game/battle/battle'
import { h } from 'preact'
import { Game } from './game/game'
import { loadModules } from './utils/module'
import { engine } from './engine'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom"
import { PathSelection } from './paths/pathSelection'
import { Main } from './menu/main'
import { useHistory } from './utils/navigation'

import './index.styl'
loadModules([engine])

const Root: Component<> = props => <Router> 
    <Switch>
        <Route path={'/menu/main'} component={ Main }/>
        <Route path={'/game'} component={ Game }/>
        <Route render={({ history }) => {
            useHistory(history)
            console.log('rendering') 
            return <Redirect to={'/menu/main'}/>
        }}/>
    </Switch>
</Router>

// HMR friendly bootstrapping
;(function bootstrap(anchorElement){
    // if(!document.getElementById('app-root')){
    render(<Root/>, anchorElement)
    // }
})(document.getElementById('anchor'))

// enables HMR at this root
if( module.hot ){ 
    (module:any).hot.accept()
}