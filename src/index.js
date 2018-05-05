import { render, Component } from 'preact'
import { Game } from './game/game'
import { loadModules } from './utils/module'
import { engine } from './engine'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom"
import { PathSelection } from './paths/pathSelection'
import { useHistory } from './utils/navigation'
import styled from 'styled-components'

import '../node_modules/font-awesome/css/font-awesome.min.css'
import './index.css'
import { Menu } from './menu/menu';

console.log('Welcome to the Deck Dawdle client')

loadModules([engine])

const Anchor = styled.div`
    overflow: hidden; 
    width: 100vw; 
    height: 100vh; 
    background-color: black;
    display: flex;
    font-size: 1.6rem;
    text-shadow:
        -1px -1px 3px #222,  
        1px -1px 3px #222,
        -1px 1px 3px #222,
        1px 1px 3px #222;
    color: #eeeeee;
    font-family: Earth;
`

const Root = props => <Anchor>
    <Router> 
        <Switch>
            <Route path={'/menu'} component={ Menu }/>
            <Route path={'/game'} component={ Game }/>
            <Route render={({ history }) => {
                useHistory(history)
                return <Redirect to={'/menu/main'}/>
            }}/>
        </Switch>
    </Router>
</Anchor>

// HMR friendly bootstrapping
;(function bootstrap(anchorElement){
    // if(!document.getElementById('app-root')){
    render(<Root/>, anchorElement)
    // }
})(document.getElementById('anchor'))

function any(any: any): any { return any }

// enables HMR at this root
if( module.hot ){ 
    any(module).hot.accept()
}