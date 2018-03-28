
import type { Component } from './component'
import { Battle } from './battle/battle'
import { h } from 'preact'

import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom"
import { PathSelection } from './pathSelection/pathSelection';

export const Main: Component<> = __ => <Router> 
    <Switch>
        <Route path={'/battle'} component={Battle}/>
        <Route exact path={'/menu/main'} component={PathSelection}/>
        <Redirect from={'/'} to={'/menu/main'}/>
    </Switch>
</Router>

