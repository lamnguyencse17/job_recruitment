import React, {Component, Fragment} from 'react';
import {Provider} from 'react-redux';
import store from '../store';
import ReactDOM from 'react-dom';

import Body from './Body/Body'
import Headnav from './Headnav/Headnav';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch,
  } from "react-router-dom";

class App extends Component {
    render() {
        return (<Provider store={store}>
            <Router>
                <Headnav/>
                <Body/>     
            </Router>
            </Provider>
            )
    }
}

ReactDOM.render (<App/>, document.getElementById("app"));
